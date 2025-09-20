import { QuartzTransformerPlugin, QuartzTransformerPluginInstance } from "../types"
import { visit } from "unist-util-visit"
import { Element, Root, Text } from "hast"
import { VFile } from "vfile"
import { BuildCtx } from "../../cfg"
import path from "path"
import fs from "fs"

// Import citation processing dependencies
import { Cite } from "@citation-js/core"
import "@citation-js/plugin-bibtex"
import "@citation-js/plugin-csl"
import rehypeCitation from "rehype-citation"

interface AlphaCitationOptions {
  bibliography: string | string[]
  path?: string
  linkCitations?: boolean
  suppressBibliography?: boolean
  locale?: string
}

interface AlphaLabel {
  id: string
  label: string
  baseLabel: string
  entry: any
}

class AlphaLabelGenerator {
  private labelCounts = new Map<string, number>()
  private resolvedLabels = new Map<string, string>()

  generateLabels(entries: any[]): Map<string, string> {
    // Step 1: Generate base labels
    const baseLabels: AlphaLabel[] = entries.map(entry => ({
      id: entry.id,
      label: this.generateBaseLabel(entry),
      baseLabel: this.generateBaseLabel(entry),
      entry
    }))

    // Step 2: Sort by base label for consistent ordering
    baseLabels.sort((a, b) => a.baseLabel.localeCompare(b.baseLabel))

    // Step 3: Resolve duplicates
    const labelMap = new Map<string, string>()
    
    baseLabels.forEach(item => {
      const finalLabel = this.resolveLabel(item.baseLabel, item.id)
      labelMap.set(item.id, finalLabel)
    })

    return labelMap
  }

  private generateBaseLabel(entry: any): string {
    const authors = this.extractAuthors(entry)
    const year = this.extractYear(entry)
    
    const namepart = this.formatNames(authors)
    const yearpart = year.toString().slice(-2).padStart(2, '0')
    
    return namepart + yearpart
  }

  private extractAuthors(entry: any): string[] {
    if (entry.author && Array.isArray(entry.author)) {
      return entry.author.map((author: any) => {
        if (typeof author === 'string') return author
        if (author.family) return author.family
        if (author.literal) return author.literal
        return String(author)
      })
    }
    
    if (entry.editor && Array.isArray(entry.editor)) {
      return entry.editor.map((editor: any) => {
        if (typeof editor === 'string') return editor
        if (editor.family) return editor.family
        if (editor.literal) return editor.literal
        return String(editor)
      })
    }

    // Fallback to title or entry id
    if (entry.title) {
      return [entry.title.substring(0, 3)]
    }
    
    return [entry.id || 'UNK']
  }

  private extractYear(entry: any): number {
    if (entry.issued && entry.issued['date-parts'] && entry.issued['date-parts'][0]) {
      return entry.issued['date-parts'][0][0] || new Date().getFullYear()
    }
    
    if (entry.year) {
      const yearMatch = String(entry.year).match(/\d{4}/)
      if (yearMatch) return parseInt(yearMatch[0])
    }
    
    return new Date().getFullYear()
  }

  private formatNames(authors: string[]): string {
    const numAuthors = authors.length
    
    if (numAuthors === 0) return "UNK"
    
    if (numAuthors === 1) {
      // Single author: [Knu79] - first letter caps, rest lowercase
      const surname = this.extractSurname(authors[0])
      return surname.charAt(0).toUpperCase() + surname.substring(1, 3).toLowerCase()
    }
    
    if (numAuthors >= 2 && numAuthors <= 4) {
      // 2-4 authors: [FSJC16] - all caps first letters
      return authors.map(name => 
        this.extractSurname(name).charAt(0).toUpperCase()
      ).join('')
    }
    
    // 5+ authors: [Sut+17] - first letter caps, rest lowercase
    const surname = this.extractSurname(authors[0])
    return surname.charAt(0).toUpperCase() + surname.substring(1, 3).toLowerCase() + '+'
  }

  private extractSurname(fullName: string): string {
    if (!fullName) return 'UNK'
    
    // Handle "Last, First" format
    if (fullName.includes(',')) {
      return fullName.split(',')[0].trim()
    }
    
    // Handle "First Last" format - get last word
    const parts = fullName.trim().split(/\s+/)
    return parts[parts.length - 1] || fullName
  }

  private resolveLabel(baseLabel: string, entryId: string): string {
    const count = this.labelCounts.get(baseLabel) || 0
    this.labelCounts.set(baseLabel, count + 1)
    
    if (count === 0) {
      this.resolvedLabels.set(entryId, baseLabel)
      return baseLabel
    }
    
    // Generate suffix: a, b, c, ... z, aa, ab, etc.
    const suffix = this.generateSuffix(count)
    const finalLabel = baseLabel + suffix
    this.resolvedLabels.set(entryId, finalLabel)
    
    return finalLabel
  }

  private generateSuffix(count: number): string {
    if (count < 26) {
      return String.fromCharCode(97 + count - 1) // a-z
    }
    
    // Handle aa, ab, ac, etc.
    const base26 = Math.floor((count - 1) / 26)
    const remainder = (count - 1) % 26
    return String.fromCharCode(97 + base26 - 1) + 
           String.fromCharCode(97 + remainder)
  }
}

export const AlphaCitation: QuartzTransformerPlugin<Partial<AlphaCitationOptions>> = (userOpts) => {
  const opts: AlphaCitationOptions = {
    bibliography: [],
    path: process.cwd(),
    linkCitations: true,
    suppressBibliography: false,
    locale: 'en-US',
    ...userOpts,
  }

  return {
    name: "AlphaCitation",
    
    htmlPlugins(ctx: BuildCtx): any[] {
      if (!opts.bibliography || (Array.isArray(opts.bibliography) && opts.bibliography.length === 0)) {
        console.warn("AlphaCitation: No bibliography specified, skipping citation processing")
        return []
      }

      return [
        // First, run standard rehype-citation to get the base structure
        [rehypeCitation, {
          bibliography: opts.bibliography,
          path: opts.path,
          csl: 'apa', // Use APA as base, we'll replace the labels
          linkCitations: opts.linkCitations,
          suppressBibliography: opts.suppressBibliography,
          locale: opts.locale,
        }],
        
        // Then post-process to apply alpha labels
        function alphaLabelProcessor() {
          return async (tree: Root, file: VFile) => {
            try {
              // Parse bibliography to generate alpha labels and get entry data
              const labelGenerator = new AlphaLabelGenerator()
              const { alphaLabels, entryData } = await generateAlphaLabelsFromBib(opts, labelGenerator)
              
              // Replace citation labels throughout the entire HTML tree
              replaceCitationLabels(tree, alphaLabels)
              
              // Replace bibliography entries
              visit(tree, 'element', (node: Element) => {
                if (isBibliographyEntry(node)) {
                  replaceBibliographyLabels(node, alphaLabels, entryData)
                }
              })
            } catch (error) {
              console.error("AlphaCitation processing error:", error)
              // Continue processing even if alpha label generation fails
            }
          }
        }
      ]
    },

    externalResources() {
      return {
        css: [{
          content: `
            .alpha-citation {
              font-weight: 500;
              color: var(--primary-color, #2563eb);
              text-decoration: none;
            }
            
            .alpha-citation:hover {
              text-decoration: underline;
            }
            
            .alpha-label {
              font-weight: 600;
              margin-right: 0.5rem;
              color: var(--text-color, #374151);
            }
            
            .bibliography-entry {
              margin-bottom: 1rem;
              padding-left: 1rem;
              text-indent: -1rem;
            }
            
            .bibliography-url {
              color: var(--primary-color, #2563eb);
              text-decoration: underline;
              font-size: 0.875rem;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              background-color: var(--bg-secondary, #f8fafc);
              padding: 0.125rem 0.375rem;
              border-radius: 0.25rem;
              border: 1px solid var(--border-color, #e2e8f0);
              transition: all 0.15s ease-in-out;
              word-break: break-all;
            }
            
            .bibliography-url:hover {
              background-color: var(--primary-color, #2563eb);
              color: white;
              text-decoration: none;
              transform: translateY(-1px);
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
            }
            
            .bibliography-url:active {
              transform: translateY(0);
              box-shadow: 0 1px 2px rgba(37, 99, 235, 0.1);
            }
            
            .bibliography-emoji-link {
              display: inline;
              margin-left: 0.25rem;
              text-decoration: none;
              font-size: 1rem;
              transition: all 0.15s ease-in-out;
            }
            
            .bibliography-emoji-link:hover {
              transform: scale(1.2);
              text-decoration: none;
            }
            
            .bibliography-emoji-link:active {
              transform: scale(1.1);
            }
          `
        }]
      }
    }
  } as QuartzTransformerPluginInstance
}

// Helper functions

async function generateAlphaLabelsFromBib(
  opts: AlphaCitationOptions, 
  generator: AlphaLabelGenerator
): Promise<{ alphaLabels: Map<string, string>, entryData: Map<string, any> }> {
  try {
    // Read and parse bibliography file(s)
    const bibliographies = Array.isArray(opts.bibliography) ? opts.bibliography : [opts.bibliography]
    let allEntries: any[] = []
    
    for (const bibFile of bibliographies) {
      const bibPath = path.resolve(opts.path || process.cwd(), bibFile)
      
      if (!fs.existsSync(bibPath)) {
        console.warn(`Bibliography file not found: ${bibPath}`)
        continue
      }
      
      const bibContent = fs.readFileSync(bibPath, 'utf8')
      const cite = new Cite(bibContent)
      const entries = cite.data
      allEntries = allEntries.concat(entries)
    }
    
    const alphaLabels = generator.generateLabels(allEntries)
    
    // Create entry data map for easy lookup
    const entryData = new Map<string, any>()
    allEntries.forEach(entry => {
      if (entry.id) {
        entryData.set(entry.id, entry)
      }
    })
    
    return { alphaLabels, entryData }
  } catch (error) {
    console.error("Error generating alpha labels:", error)
    return { alphaLabels: new Map(), entryData: new Map() }
  }
}

function isBibliographyEntry(node: Element): boolean {
  return node.tagName === 'div' &&
         node.properties?.className &&
         Array.isArray(node.properties.className) &&
         (node.properties.className.includes('csl-entry') || 
          node.properties.className.includes('bibliography-entry'))
}

function replaceCitationLabels(tree: Root, alphaLabels: Map<string, string>) {
  // Recursively find and replace all citation links throughout the entire tree
  visit(tree, 'element', (element: Element) => {
    // Handle direct citation links
    if (element.tagName === 'a' && element.properties?.href) {
      const href = String(element.properties.href)
      const match = href.match(/#(?:bib-)?(.+)$/)
      
      if (match && match[1]) {
        const citationKey = match[1]
        const alphaLabel = alphaLabels.get(citationKey)
        
        if (alphaLabel) {
          // Replace the text content with alpha label
          element.children = [{ type: 'text', value: `[${alphaLabel}]` }]
          
          // Add alpha citation class
          const classes = Array.isArray(element.properties.className) 
            ? element.properties.className 
            : []
          element.properties.className = [...classes, 'alpha-citation']
        }
      }
    }
  })
}

function replaceBibliographyLabels(node: Element, alphaLabels: Map<string, string>, entryData: Map<string, any>) {
  // Extract citation key from id (e.g., bib-smith2020 -> smith2020)
  if (node.properties?.id) {
    const id = String(node.properties.id)
    const match = id.match(/^(?:bib-)?(.+)$/)
    
    if (match && match[1]) {
      const citationKey = match[1]
      const alphaLabel = alphaLabels.get(citationKey)
      const entry = entryData.get(citationKey)
      
      if (alphaLabel) {
        // Prepend alpha label to bibliography entry
        const labelElement: Element = {
          type: 'element',
          tagName: 'span',
          properties: { className: ['alpha-label'] },
          children: [{ type: 'text', value: `[${alphaLabel}]` }]
        }
        
        node.children.unshift(labelElement, { type: 'text', value: ' ' })
        
        // NEW: Format author names and handle smart links in bibliography
        if (entry) {
          formatAuthorNames(node)
          removeExistingUrls(node, entry)
          appendSmartLinks(node, entry)
        }
      }
    }
  }
}

// NEW FUNCTION: Format author names in bibliography entries
function formatAuthorNames(node: Element) {
  visit(node, 'text', (textNode: Text) => {
    let text = textNode.value
    
    // Replace author name patterns: "Surname, F." -> "F. Surname"
    // Handle various initials patterns: F., F. M., F. M. K., etc.
    text = text.replace(/([A-Z][a-z]+),\s+([A-Z]\.(?:\s+[A-Z]\.)*)/g, '$2 $1')
    
    // Replace final ampersand with "and"
    text = text.replace(/\s&\s/g, ' and ')
    
    // Update the text node
    textNode.value = text
  })
}

// NEW FUNCTION: Remove existing URLs from text (added by rehype-citation)
function removeExistingUrls(node: Element, entry: any) {
  // Get all possible URLs that might be in the text
  const urlsToRemove = []
  
  if (entry.DOI || entry.doi) {
    const doi = entry.DOI || entry.doi
    urlsToRemove.push(`https://doi.org/${doi}`)
  }
  
  if (entry.URL || entry.url) {
    urlsToRemove.push(entry.URL || entry.url)
  }
  
  if (entry.archivePrefix === 'arXiv' && entry.eprint) {
    urlsToRemove.push(`https://arxiv.org/abs/${entry.eprint}`)
  }
  
  if (entry.pdf) {
    urlsToRemove.push(entry.pdf)
  }
  
  // Remove these URLs from text nodes
  visit(node, 'text', (textNode: Text) => {
    let text = textNode.value
    
    urlsToRemove.forEach(url => {
      if (url && text.includes(url)) {
        // Remove the URL and any surrounding whitespace
        text = text.replace(new RegExp(`\\s*${escapeRegex(url)}\\s*`, 'g'), ' ')
        text = text.replace(/\s+/g, ' ').trim() // Clean up extra spaces
      }
    })
    
    textNode.value = text
  })
}

// Helper function to escape special regex characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// NEW FUNCTION: Generate smart links based on simplified hierarchy
function generateSmartLinks(entry: any): { primary?: {url: string, text: string}, secondary?: {url: string, emoji: string} } {
  const result: { primary?: {url: string, text: string}, secondary?: {url: string, emoji: string} } = {}
  
  // Extract standard BibTeX fields only
  const doi = entry.DOI || entry.doi
  const url = entry.URL || entry.url
  const archivePrefix = entry.archivePrefix
  const eprint = entry.eprint
  
  // Case 1: arXiv has highest priority for academic papers
  if (archivePrefix === 'arXiv' && eprint) {
    const arxivUrl = `https://arxiv.org/abs/${eprint}`
    result.primary = { url: arxivUrl, text: arxivUrl }
    
    // Always add PDF link for arXiv (🖻 links to PDF version)
    const arxivPdfUrl = `https://arxiv.org/pdf/${eprint}`
    result.secondary = { url: arxivPdfUrl, emoji: '   ↪ 🖻' }
  } 

  // Case 2: DOI as primary (most permanent)
  else if (doi) {
    const doiUrl = `https://doi.org/${doi}`
    result.primary = { url: doiUrl, text: doiUrl }
    
    // Check if URL contains DOI, if not add as secondary with 🖻
    if (url && !url.includes(doi)) {
      result.secondary = { url: url, emoji: '   ↪ 🖻' }
    }
  }

  // Case 3: URL only (fallback)
  else if (url && url.slice(-4) === '.pdf') {
    result.secondary = { url: url, emoji: '   ↪ 🖻' }
  }

  else if (url && url.slice(-4) !== '.pdf') {
    result.primary = { url: url, text: url }
  }
  
  return result
}

// NEW FUNCTION: Append smart links to bibliography entry
function appendSmartLinks(node: Element, entry: any) {
  const links = generateSmartLinks(entry)
  
  if (!links.primary && !links.secondary) return
  
  // Helper function to append a link
  const appendLink = (linkData: {url: string, text?: string, emoji?: string}) => {
    // Add space before link
    node.children.push({ type: 'text', value: ' ' })
    
    // Create link element
    const linkElement: Element = {
      type: 'element',
      tagName: 'a',
      properties: {
        href: linkData.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: linkData.emoji ? ['bibliography-emoji-link'] : ['bibliography-url']
      },
      children: [{ type: 'text', value: linkData.emoji || linkData.text || linkData.url }]
    }
    
    node.children.push(linkElement)
  }
  
  // Add primary link
  if (links.primary) {
    appendLink({ url: links.primary.url, text: links.primary.text })
  }
  
  // Add secondary link (with 🖻 emoji)
  if (links.secondary) {
    appendLink({ url: links.secondary.url, emoji: links.secondary.emoji })
  }
}
