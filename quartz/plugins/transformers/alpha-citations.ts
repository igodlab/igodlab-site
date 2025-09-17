import { QuartzTransformerPlugin, QuartzTransformerPluginInstance } from "../types"
import { visit } from "unist-util-visit"
import { Element, Root } from "hast"
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
              // Parse bibliography to generate alpha labels
              const labelGenerator = new AlphaLabelGenerator()
              const alphaLabels = await generateAlphaLabelsFromBib(opts, labelGenerator)
              
              // Replace citation labels in the HTML tree
              visit(tree, 'element', (node: Element) => {
                // Replace inline citations
                if (isInlineCitation(node)) {
                  replaceCitationLabels(node, alphaLabels)
                }
                
                // Replace bibliography entries
                if (isBibliographyEntry(node)) {
                  replaceBibliographyLabels(node, alphaLabels)
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
): Promise<Map<string, string>> {
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
    
    return generator.generateLabels(allEntries)
  } catch (error) {
    console.error("Error generating alpha labels:", error)
    return new Map()
  }
}

function isInlineCitation(node: Element): boolean {
  return node.tagName === 'span' && 
         node.properties?.className &&
         Array.isArray(node.properties.className) &&
         node.properties.className.includes('citation')
}

function isBibliographyEntry(node: Element): boolean {
  return node.tagName === 'div' &&
         node.properties?.className &&
         Array.isArray(node.properties.className) &&
         (node.properties.className.includes('csl-entry') || 
          node.properties.className.includes('bibliography-entry'))
}

function replaceCitationLabels(node: Element, alphaLabels: Map<string, string>) {
  visit(node, 'element', (child: Element) => {
    if (child.tagName === 'a' && child.properties?.href) {
      // Extract citation key from href (e.g., #bib-smith2020 -> smith2020)
      const href = String(child.properties.href)
      const match = href.match(/#(?:bib-)?(.+)$/)
      
      if (match && match[1]) {
        const citationKey = match[1]
        const alphaLabel = alphaLabels.get(citationKey)
        
        if (alphaLabel) {
          // Replace the text content with alpha label
          child.children = [{ type: 'text', value: `[${alphaLabel}]` }]
          
          // Add alpha citation class
          const classes = Array.isArray(child.properties.className) 
            ? child.properties.className 
            : []
          child.properties.className = [...classes, 'alpha-citation']
        }
      }
    }
  })
}

function replaceBibliographyLabels(node: Element, alphaLabels: Map<string, string>) {
  // Extract citation key from id (e.g., bib-smith2020 -> smith2020)
  if (node.properties?.id) {
    const id = String(node.properties.id)
    const match = id.match(/^(?:bib-)?(.+)$/)
    
    if (match && match[1]) {
      const citationKey = match[1]
      const alphaLabel = alphaLabels.get(citationKey)
      
      if (alphaLabel) {
        // Prepend alpha label to bibliography entry
        const labelElement: Element = {
          type: 'element',
          tagName: 'span',
          properties: { className: ['alpha-label'] },
          children: [{ type: 'text', value: `[${alphaLabel}]` }]
        }
        
        node.children.unshift(labelElement, { type: 'text', value: ' ' })
      }
    }
  }
}
