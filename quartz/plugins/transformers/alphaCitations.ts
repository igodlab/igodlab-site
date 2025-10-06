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

interface CitationEntry {
  id: string
  alphaLabel: string
  authors: string[]
  title: string
  year: number
  journal?: string
  volume?: string
  number?: string
  pages?: string
  publisher?: string
  edition?: string
  doi?: string
  url?: string
  archivePrefix?: string
  eprint?: string
  rawEntry: any
}

class AlphaLabelGenerator {
  private labelCounts = new Map<string, number>()
  private resolvedLabels = new Map<string, string>()

  generateLabels(entries: CitationEntry[]): Map<string, string> {
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

  private generateBaseLabel(entry: CitationEntry): string {
    const namepart = this.formatNames(entry.authors)
    const yearpart = entry.year.toString().slice(-2).padStart(2, '0')
    
    return namepart + yearpart
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

  // Parse bibliography once during plugin initialization
  let citations: Map<string, CitationEntry> = new Map()
  let alphaLabels: Map<string, string> = new Map()

  const initializeCitations = async () => {
    try {
      const bibliographies = Array.isArray(opts.bibliography) ? opts.bibliography : [opts.bibliography]
      let allEntries: any[] = []
      
      console.log('🔍 Processing bibliography files:', bibliographies)
      
      for (const bibFile of bibliographies) {
        const bibPath = path.resolve(opts.path || process.cwd(), bibFile)
        
        if (!fs.existsSync(bibPath)) {
          console.warn(`Bibliography file not found: ${bibPath}`)
          continue
        }
        
        console.log(`📖 Reading bibliography: ${bibPath}`)
        const bibContent = fs.readFileSync(bibPath, 'utf8')
        const cite = new Cite(bibContent)
        const entries = cite.data
        console.log(`📚 Found ${entries.length} entries in ${bibFile}`)
        
        // Debug: show first few entries
        entries.slice(0, 3).forEach(entry => {
          console.log(`   Entry ID: ${entry.id}, Title: ${entry.title}`)
        })
        
        allEntries = allEntries.concat(entries)
      }
      
      console.log(`📋 Total entries parsed: ${allEntries.length}`)
      
      // Convert to our CitationEntry format
      const citationEntries: CitationEntry[] = allEntries.map(entry => ({
        id: entry.id,
        alphaLabel: '', // Will be set later
        authors: extractAuthors(entry),
        title: entry.title || '',
        year: extractYear(entry),
        journal: entry['container-title'] || entry.journal,
        volume: entry.volume,
        number: entry.number || entry.issue,
        pages: entry.page,
        publisher: entry.publisher,
        edition: entry.edition,
        doi: entry.DOI || entry.doi,
        url: entry.URL || entry.url,
        archivePrefix: entry.archivePrefix,
        eprint: entry.eprint,
        rawEntry: entry
      }))

      // Generate alpha labels
      const labelGenerator = new AlphaLabelGenerator()
      alphaLabels = labelGenerator.generateLabels(citationEntries)
      
      console.log(`🏷️  Generated ${alphaLabels.size} alpha labels`)
      
      // Store citations with alpha labels
      citationEntries.forEach(entry => {
        entry.alphaLabel = alphaLabels.get(entry.id) || 'UNK'
        citations.set(entry.id, entry)
      })

      console.log(`✅ Citations initialized: ${citations.size} entries available`)

    } catch (error) {
      console.error("❌ Error initializing citations:", error)
    }
  }

  return {
    name: "AlphaCitation",
    
    htmlPlugins(ctx: BuildCtx): any[] {
      if (!opts.bibliography || (Array.isArray(opts.bibliography) && opts.bibliography.length === 0)) {
        console.warn("AlphaCitation: No bibliography specified, skipping citation processing")
        return []
      }

      return [
        function alphaCitationProcessor() {
          return async (tree: Root, file: VFile) => {
            // Initialize citations if not done yet
            if (citations.size === 0) {
              await initializeCitations()
            }

            // Process citations in the document - safer approach
            const citationsFound = new Set<string>()
            const replacements = []
            
            // First pass: find all citations without modifying the tree
            visit(tree, 'text', (node: Text, index, parent) => {
              if (!parent || typeof index !== 'number') return
              
              const text = node.value
              // Match [@citationkey] patterns only for now
              const citationPattern = /\[@([^\]]+)\]/g
              
              let match
              const citationsInText = []
              
              while ((match = citationPattern.exec(text)) !== null) {
                const citationKeys = match[1].split(';').map(key => key.trim().replace(/^@/, ''))
                
                citationsInText.push({
                  match: match[0],
                  keys: citationKeys,
                  start: match.index,
                  end: match.index + match[0].length
                })
                
                // Add to found citations
                citationKeys.forEach(key => {
                  if (citations.get(key)) {
                    citationsFound.add(key)
                  }
                })
              }
              
              if (citationsInText.length > 0) {
                replacements.push({
                  node,
                  parent,
                  index,
                  citations: citationsInText,
                  originalText: text
                })
              }
            })
            
            // Second pass: apply all replacements
            for (const replacement of replacements) {
              const { node, parent, index, citations: citationsInText, originalText } = replacement
              
              if (!parent.children[index] || parent.children[index] !== node) {
                continue // Skip if tree changed
              }
              
              const newChildren = []
              let lastIndex = 0
              
              for (const citationInfo of citationsInText) {
                // Add text before citation
                if (citationInfo.start > lastIndex) {
                  newChildren.push({
                    type: 'text',
                    value: originalText.substring(lastIndex, citationInfo.start)
                  })
                }
                
                // Create citation links (no parentheses)
                citationInfo.keys.forEach((key, idx) => {
                  const citation = citations.get(key)
                  if (citation) {
                    if (idx > 0) {
                      newChildren.push({ type: 'text', value: '; ' })
                    }
                    
                    newChildren.push({
                      type: 'element',
                      tagName: 'a',
                      properties: {
                        href: `#bib-${key}`,
                        className: ['alpha-citation']
                      },
                      children: [{ type: 'text', value: `[${citation.alphaLabel}]` }]
                    })
                  } else {
                    if (idx > 0) {
                      newChildren.push({ type: 'text', value: '; ' })
                    }
                    newChildren.push({ type: 'text', value: `[@${key}]` })
                  }
                })
                
                lastIndex = citationInfo.end
              }
              
              // Add remaining text
              if (lastIndex < originalText.length) {
                newChildren.push({
                  type: 'text',
                  value: originalText.substring(lastIndex)
                })
              }
              
              // Replace the node
              parent.children.splice(index, 1, ...newChildren)
            }
            
            // Add bibliography section if citations were found and not suppressed
            if (citationsFound.size > 0 && !opts.suppressBibliography) {
              addBibliographySection(tree, citationsFound, citations)
            }
          }
        }
      ]
    },

    externalResources() {
      return {
        css: [
          // FontAwesome CDN
          {
            inline: false,
            content: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
          },
          // Inline custom styles
          {
            inline: true,
            content: `
            .alpha-citation {
              font-weight: 500;
              text-decoration: none;
            }
            
            .alpha-citation:hover {
              text-decoration: underline;
            }
            
            .alpha-label {
              font-weight: 600;
              color: inherit;
            }
            
            .bibliography-section {
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid var(--border-color, #b8a1e3);
            }
            
            .bibliography-entry {
              position: relative;      /* For absolute positioning of label */
              margin-bottom: 1.75rem;
              padding-left: 5rem;      /* Increased spacing - more room after handles */
              line-height: 1.65;
              /* No text-indent needed! */
            }
            
            /* Position the label absolutely */
            .bibliography-entry .alpha-label {
              position: absolute;
              left: 0;
              top: 0;
              display: inline-block;
              width: 4rem;             /* Slightly wider to accommodate longer handles */
              font-weight: 600;
              color: inherit;
            }
            
            .bibliography-url {
              text-decoration: underline;
              font-size: 0.875rem;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              padding: 0.125rem 0.375rem;
              border-radius: 0.25rem;
              border: 1px solid var(--border-color, #b8a1e3);
              transition: all 0.15s ease-in-out;
              word-break: break-all;
            }
            
            .bibliography-url:hover {
              transform: translateY(-1px);
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
            }
            
            .bibliography-url:active {
              transform: translateY(0);
              box-shadow: 0 1px 2px rgba(37, 99, 235, 0.1);
            }
            
            .bibliography-emoji-link {
              display: inline-block;
              margin-left: 0.5rem;     /* Moderate spacing from previous text */
              padding: 0.2rem 0.4rem;
              border: 1px solid var(--border-color, #b8a1e3);
              border-radius: 0.25rem;
              text-decoration: none;
              font-size: 0.875rem;
              transition: all 0.15s ease-in-out;
              vertical-align: middle;  /* Better alignment with text */
            }
            
            .bibliography-emoji-link:hover {
              transform: translateY(-1px);
              box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
            }
            
            .bibliography-emoji-link:active {
              transform: translateY(0);
              box-shadow: 0 1px 2px rgba(37, 99, 235, 0.1);
            }
          `
          }
        ]
      }
    }
  } as QuartzTransformerPluginInstance
}

// Helper functions

function extractAuthors(entry: any): string[] {
  if (entry.author && Array.isArray(entry.author)) {
    return entry.author.map((author: any) => {
      if (typeof author === 'string') return author
      if (author.family && author.given) {
        return `${author.family}, ${author.given}`
      }
      if (author.family) return author.family
      if (author.literal) return author.literal
      return String(author)
    })
  }
  
  if (entry.editor && Array.isArray(entry.editor)) {
    return entry.editor.map((editor: any) => {
      if (typeof editor === 'string') return editor
      if (editor.family && editor.given) {
        return `${editor.family}, ${editor.given}`
      }
      if (editor.family) return editor.family
      if (editor.literal) return editor.literal
      return String(editor)
    })
  }

  return []
}

function extractYear(entry: any): number {
  if (entry.issued && entry.issued['date-parts'] && entry.issued['date-parts'][0]) {
    return entry.issued['date-parts'][0][0] || new Date().getFullYear()
  }
  
  if (entry.year) {
    const yearMatch = String(entry.year).match(/\d{4}/)
    if (yearMatch) return parseInt(yearMatch[0])
  }
  
  return new Date().getFullYear()
}

function formatAuthorNames(authors: string[]): string {
  if (authors.length === 0) return ''
  
  return authors.map((author, idx) => {
    // Convert "Surname, Given" to "G. Surname"
    if (author.includes(',')) {
      const [surname, given] = author.split(',').map(s => s.trim())
      const initials = given.split(/\s+/).map(name => name.charAt(0).toUpperCase()).join('. ')
      return `${initials}. ${surname}`
    }
    return author
  }).join(', ').replace(/,\s*([^,]+)$/, ' and $1') // Replace last comma with "and"
}

function generateSmartLinks(entry: CitationEntry): { primary?: {url: string, text: string}, secondary?: {url: string, iconType: 'pdf'} } {
  const result: { primary?: {url: string, text: string}, secondary?: {url: string, iconType: 'pdf'} } = {}
  
  // Case 1: arXiv has highest priority for academic papers
  // if (entry.archivePrefix === 'arXiv' && entry.eprint) {
  if (entry.archivePrefix) {
    const arxivUrl = `https://arxiv.org/abs/${entry.eprint}`
    result.primary = { url: arxivUrl, text: arxivUrl }
    
    // Always add PDF link for arXiv
    const arxivPdfUrl = `https://arxiv.org/pdf/${entry.eprint}`
    result.secondary = { url: arxivPdfUrl, iconType: 'pdf' }
    
  } 
  // Case 2: DOI as primary (most permanent)
  else if (entry.doi) {
    const doiUrl = `https://doi.org/${entry.doi}`
    result.primary = { url: doiUrl, text: doiUrl }
    
    // Check if URL contains DOI, if not add as secondary with PDF icon
    if (entry.url && !entry.url.includes(entry.doi)) {
      result.secondary = { url: entry.url, iconType: 'pdf' }
    }
    
  }
  // Case 3: URL only (fallback)
  else if (entry.url) {
    // check if url is a pdf actually
    if (entry.url.endsWith(".pdf")) {
      result.secondary = { url: entry.url, iconType: 'pdf' }
    }
    else {
      result.primary = { url: entry.url, text: entry.url }
    }
  }
  
  return result
}

function addBibliographySection(tree: Root, citationsFound: Set<string>, citations: Map<string, CitationEntry>) {
  // Sort citations by alpha label for consistent ordering
  const sortedCitations = Array.from(citationsFound)
    .map(key => citations.get(key)!)
    .sort((a, b) => a.alphaLabel.localeCompare(b.alphaLabel))

  // Create bibliography section
  const bibliographySection: Element = {
    type: 'element',
    tagName: 'div',
    properties: { className: ['bibliography-section'] },
    children: [
      {
        type: 'element',
        tagName: 'h2',
        properties: {},
        children: [{ type: 'text', value: 'References' }]
      }
    ]
  }

  // Add each citation entry
  sortedCitations.forEach(citation => {
    const entryElement = createBibliographyEntry(citation)
    bibliographySection.children.push(entryElement)
  })

  // Add to document
  tree.children.push(bibliographySection)
}

function createBibliographyEntry(citation: CitationEntry): Element {
  const children = []
  
  // Alpha label
  children.push({
    type: 'element',
    tagName: 'span',
    properties: { className: ['alpha-label'] },
    children: [{ type: 'text', value: `[${citation.alphaLabel}]` }]
  })
  
  children.push({ type: 'text', value: ' ' })
  
  // Authors
  if (citation.authors.length > 0) {
    children.push({ type: 'text', value: formatAuthorNames(citation.authors) })
    children.push({ type: 'text', value: ' ' })
  }
  
  // Year
  children.push({ type: 'text', value: `(${citation.year}). ` })
  
  // Title (italic with quotes)
  if (citation.title) {
    children.push({
      type: 'element',
      tagName: 'em',
      properties: {},
      children: [{ type: 'text', value: `"${citation.title}"` }]
    })
    children.push({ type: 'text', value: '. ' })
  }
  
  // Journal/Publisher info
  if (citation.journal) {
    children.push({ type: 'text', value: citation.journal })
    
    if (citation.volume) {
      children.push({ type: 'text', value: `, ${citation.volume}` })
      
      if (citation.number) {
        children.push({ type: 'text', value: `(${citation.number})` })
      }
    }
    
    if (citation.pages) {
      children.push({ type: 'text', value: `, ${citation.pages}` })
    }
    
    children.push({ type: 'text', value: '. ' })
  } else if (citation.publisher) {
    children.push({ type: 'text', value: citation.publisher })
    if (citation.edition) {
      children.push({ type: 'text', value: ` (${citation.edition} ed.)` })
    }
    children.push({ type: 'text', value: '. ' })
  }
  
  // Add smart links
  const links = generateSmartLinks(citation)
  
  if (links.primary) {
    children.push({
      type: 'element',
      tagName: 'a',
      properties: {
        href: links.primary.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: ['bibliography-url']
      },
      children: [{ type: 'text', value: links.primary.text }]
    })
  }
  
  if (links.secondary) {
    children.push({ type: 'text', value: ' ' })
    children.push({
      type: 'element',
      tagName: 'a',
      properties: {
        href: links.secondary.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: ['bibliography-emoji-link'],
        title: 'Download PDF'
      },
      children: [
        {
          type: 'element',
          tagName: 'i',
          properties: {
            className: ['fa-solid', 'fa-file-pdf']  // FontAwesome icon classes
          },
          children: []  // Icon elements have no children
        }
      ]
    })
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: { 
      id: `bib-${citation.id}`,
      className: ['bibliography-entry'] 
    },
    children
  }
}
