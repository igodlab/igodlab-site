import rehypeCitation from "rehype-citation"
import { PluggableList } from "unified"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  bibliographyFile: string
  suppressBibliography: boolean
  linkCitations: boolean
  csl: string
  useAlphabeticStyle: boolean
}

const defaultOptions: Options = {
  bibliographyFile: "./bibliography.bib",
  suppressBibliography: false,
  linkCitations: true,
  csl: "apa",
  useAlphabeticStyle: true
}

export const Citations: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  return {
    name: "Citations",
    htmlPlugins(ctx) {
      const plugins: PluggableList = []

      // Add standard rehype-citation plugin
      plugins.push([
        rehypeCitation,
        {
          bibliography: opts.bibliographyFile,
          suppressBibliography: opts.suppressBibliography,
          linkCitations: opts.linkCitations,
          csl: opts.csl,
          lang: ctx.cfg.configuration.locale ?? "en-US",
        },
      ])

      if (opts.useAlphabeticStyle) {
        // Transform to alphabetic style after standard processing
        plugins.push(() => {
          return (tree, _file) => {
            const bibliographyEntries: any[] = []

            // First pass: Extract bibliography entries
            visit(tree, "element", (node, _index, _parent) => {
              if (node.tagName === "div" && 
                  Array.isArray(node.properties?.className) &&
                  node.properties.className.includes("csl-entry")) {
                
                const bibId = node.properties?.id as string
                if (bibId) {
                  const entry = extractBibDataFromHTML(node, bibId)
                  bibliographyEntries.push(entry)
                }
              }
            })

            // Generate alphabetic labels
            if (bibliographyEntries.length > 0) {
              const alphaEntries = generateAlphabeticLabels(bibliographyEntries)
              
              // Create citation mapping
              const citationMap = new Map<string, string>()
              alphaEntries.forEach(entry => {
                citationMap.set(`#${entry.id}`, entry.alphaLabel)
                citationMap.set(`#bib-${entry.id}`, entry.alphaLabel)
              })

              // Second pass: Update citation links
              visit(tree, "element", (node, _index, _parent) => {
                if (node.tagName === "a" && 
                    typeof node.properties?.href === "string" &&
                    node.properties.href.startsWith("#")) {
                  
                  const href = node.properties.href as string
                  const alphaLabel = citationMap.get(href)
                  
                  if (alphaLabel) {
                    node.children = [{
                      type: "text",
                      value: `[${alphaLabel}]`
                    }]
                    node.properties["data-no-popover"] = true
                  }
                }
              })

              // Third pass: Update bibliography entries
              visit(tree, "element", (node, _index, _parent) => {
                if (node.tagName === "div" && 
                    Array.isArray(node.properties?.className) &&
                    node.properties.className.includes("csl-entry")) {
                  
                  const bibId = (node.properties?.id as string)?.replace("bib-", "") || ""
                  const alphaEntry = alphaEntries.find(e => e.id === bibId)
                  
                  if (alphaEntry) {
                    const originalText = getTextContent(node)
                    
                    node.children = [
                      {
                        type: "element",
                        tagName: "strong",
                        properties: { className: ["alpha-label"] },
                        children: [{ 
                          type: "text", 
                          value: `[${alphaEntry.alphaLabel}] ` 
                        }]
                      },
                      {
                        type: "text",
                        value: originalText
                      }
                    ]
                  }
                }
              })

              // Fourth pass: Sort bibliography alphabetically
              visit(tree, "element", (node, _index, _parent) => {
                if (node.tagName === "div" && 
                    Array.isArray(node.properties?.className) &&
                    node.properties.className.includes("csl-bib-body")) {
                  
                  const entries = node.children.filter((child: any) => 
                    child.type === "element" && 
                    child.tagName === "div" &&
                    Array.isArray(child.properties?.className) &&
                    child.properties.className.includes("csl-entry")
                  ) as any[]
                  
                  entries.sort((a, b) => {
                    const aId = (a.properties?.id as string)?.replace("bib-", "") || ""
                    const bId = (b.properties?.id as string)?.replace("bib-", "") || ""
                    const aEntry = alphaEntries.find(e => e.id === aId)
                    const bEntry = alphaEntries.find(e => e.id === bId)
                    
                    if (!aEntry || !bEntry) return 0
                    return aEntry.alphaLabel.localeCompare(bEntry.alphaLabel)
                  })
                  
                  const otherChildren = node.children.filter((child: any) => 
                    !(child.type === "element" && 
                      child.tagName === "div" &&
                      Array.isArray(child.properties?.className) &&
                      child.properties.className.includes("csl-entry"))
                  )
                  
                  node.children = [...otherChildren, ...entries]
                }
              })
            }
          }
        })
      }

      // Add data-no-popover to all citation links
      plugins.push(() => {
        return (tree, _file) => {
          visit(tree, "element", (node, _index, _parent) => {
            if (node.tagName === "a" && 
                typeof node.properties?.href === "string" &&
                node.properties.href.startsWith("#bib")) {
              node.properties["data-no-popover"] = true
            }
          })
        }
      })

      return plugins
    },
  }
}

// Helper functions for alphabetic citation generation
function generateAlphabeticLabels(entries: any[]) {
  const alphaEntries = entries.map(entry => {
    const authors = extractAuthorsFromText(entry.textContent || "")
    const year = extractYearFromText(entry.textContent || "")
    const alphaLabel = generateAlphaLabel(authors, year)
    
    return {
      ...entry,
      alphaLabel,
      sortKey: alphaLabel,
      authors,
      year
    }
  })
  
  return resolveConflicts(alphaEntries)
}

function generateAlphaLabel(authors: string[], year: string): string {
  const yearShort = year.slice(-2)
  
  if (authors.length === 1) {
    const surname = authors[0]
    const prefix = surname.slice(0, 3)
    return `${prefix}${yearShort}`
  } else if (authors.length <= 3) {
    const prefix = authors.map(author => author.charAt(0)).join('')
    return `${prefix}${yearShort}`
  } else {
    const firstAuthor = authors[0]
    const prefix = firstAuthor.slice(0, 3) + '+'
    return `${prefix}${yearShort}`
  }
}

function resolveConflicts(entries: any[]): any[] {
  const labelGroups = new Map<string, any[]>()
  
  for (const entry of entries) {
    const baseLabel = entry.alphaLabel
    if (!labelGroups.has(baseLabel)) {
      labelGroups.set(baseLabel, [])
    }
    labelGroups.get(baseLabel)!.push(entry)
  }
  
  const result: any[] = []
  const sortedLabels = Array.from(labelGroups.keys()).sort()
  
  for (const baseLabel of sortedLabels) {
    const group = labelGroups.get(baseLabel)!
    
    if (group.length === 1) {
      result.push(group[0])
    } else {
      group.forEach((entry, index) => {
        const suffix = String.fromCharCode(97 + index)
        const resolvedEntry = {
          ...entry,
          alphaLabel: baseLabel + suffix,
          sortKey: baseLabel + suffix
        }
        result.push(resolvedEntry)
      })
    }
  }
  
  return result.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
}

function extractBibDataFromHTML(node: any, bibId: string): any {
  const textContent = getTextContent(node)
  
  return {
    id: bibId.replace("bib-", ""),
    textContent,
    htmlNode: node
  }
}

function getTextContent(element: any): string {
  let text = ""
  
  function traverse(node: any) {
    if (node.type === "text") {
      text += node.value
    } else if (node.children) {
      node.children.forEach(traverse)
    }
  }
  
  traverse(element)
  return text
}

function extractTitleFromText(text: string): string {
  const titleMatch = text.match(/"([^"]+)"/)
  return titleMatch ? titleMatch[1] : text.split('.')[0]
}

function extractAuthorsFromText(text: string): string[] {
  const authorMatch = text.match(/^([^.]+)\./)
  if (!authorMatch) return ['Unknown']
  
  const authorString = authorMatch[1]
  const authors = authorString.split(/,|\sand\s/)
    .map(author => author.trim())
    .filter(author => author.length > 0)
    .map(author => {
      const parts = author.split(/\s+/)
      return parts[parts.length - 1].replace(/[.,]$/, '')
    })
  
  return authors.length > 0 ? authors : ['Unknown']
}

function extractYearFromText(text: string): string {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/)
  return yearMatch ? yearMatch[0] : "0000"
}
