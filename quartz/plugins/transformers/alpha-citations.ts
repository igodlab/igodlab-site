// quartz/plugins/transformers/alpha-citations.ts
import { QuartzTransformerPlugin, QuartzTransformerPluginInstance } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"
import { Cite } from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import path from "path"
import fs from "fs"

interface BibEntry {
  id: string;
  type: string;
  author?: Array<{given: string, family: string, literal?: string}>;
  editor?: Array<{given: string, family: string, literal?: string}>;
  title?: string;
  'container-title'?: string; // journal, booktitle
  volume?: string | number;
  issue?: string | number; // number field in BibTeX
  page?: string;
  'page-first'?: string;
  issued?: {['date-parts']: number[][]}; // year, month
  publisher?: string;
  'publisher-place'?: string; // address
  note?: string;
  keyword?: string; // key field
  [key: string]: any; // for additional fields
}

interface AlphaCitationsOptions {
  bibFile?: string; // Path to .bib file relative to content root
  generateBibliographyPage?: boolean; // Whether to generate a dedicated bibliography page
  bibliographyTitle?: string; // Title for the bibliography page
  linkCitations?: boolean; // Whether to automatically link citations to bibliography
}

class AlphaStyleGenerator {
  private etAlCharUsed = false;
  private citationCache: Map<string, string> = new Map();
  private bibliographyEntries: Array<{label: string, formatted: string, sortKey: string, originalId: string}> = [];
  
  constructor() {}

  // Parse .bib file using citation-js
  parseBibFile(bibContent: string): BibEntry[] {
    try {
      const cite = new Cite(bibContent, { forceType: '@bibtex/text' });
      const entries = cite.data as BibEntry[];
      
      console.log('Parsed entries:', entries.length);
      
      return entries;
    } catch (error) {
      console.error('Error parsing BibTeX file:', error);
      throw error;
    }
  }

  // Generate alpha-style label (e.g., "Knu79")
  generateAlphaLabel(entry: BibEntry): string {
    let authorPart = "";
    
    // Handle different author/editor scenarios
    if (entry.author && entry.author.length > 0) {
      authorPart = this.formatLabNames(entry.author);
    } else if (entry.editor && entry.editor.length > 0) {
      authorPart = this.formatLabNames(entry.editor);
    } else if (entry.keyword) {
      // Use 'key' field if available
      authorPart = entry.keyword.substring(0, 3).toUpperCase();
    } else {
      // Fallback to cite key
      authorPart = entry.id.substring(0, 3).toUpperCase();
    }

    // Extract year (last 2 digits)
    let yearPart = "";
    if (entry.issued && entry.issued['date-parts'] && entry.issued['date-parts'][0]) {
      const year = entry.issued['date-parts'][0][0];
      yearPart = year.toString().slice(-2);
    }

    return authorPart + yearPart;
  }

  // Format author names for label generation
  private formatLabNames(authors: Array<{given: string, family: string, literal?: string}>): string {
    const numAuthors = authors.length;
    
    if (numAuthors === 1) {
      const surname = authors[0].family || authors[0].literal || "";
      return surname.length >= 3 ? surname.substring(0, 3).toUpperCase() : surname.toUpperCase();
    }
    
    if (numAuthors <= 3) {
      // Use first letter of each surname
      return authors
        .map(author => (author.family || author.literal || "").charAt(0).toUpperCase())
        .join("");
    }
    
    if (numAuthors === 4) {
      // All four first letters
      return authors
        .map(author => (author.family || author.literal || "").charAt(0).toUpperCase())
        .join("");
    }
    
    // More than 4 authors: first 3 + "+"
    const first3 = authors.slice(0, 3)
      .map(author => (author.family || author.literal || "").charAt(0).toUpperCase())
      .join("");
    
    this.etAlCharUsed = true;
    return first3 + "+";
  }

  // Format author names for bibliography
  formatAuthors(authors: Array<{given: string, family: string, literal?: string}>): string {
    if (!authors || authors.length === 0) return "";
    
    const formatName = (author: {given: string, family: string, literal?: string}) => {
      if (author.literal) return author.literal;
      const given = author.given || "";
      const family = author.family || "";
      return given ? `${given} ${family}` : family;
    };

    if (authors.length === 1) {
      return formatName(authors[0]);
    } else if (authors.length === 2) {
      return `${formatName(authors[0])} and ${formatName(authors[1])}`;
    } else {
      const allButLast = authors.slice(0, -1).map(formatName).join(", ");
      return `${allButLast}, and ${formatName(authors[authors.length - 1])}`;
    }
  }

  // Format title with proper capitalization
  formatTitle(title: string): string {
    if (!title) return "";
    // Basic title case - you might want more sophisticated handling
    return title.replace(/\{([^}]*)\}/g, '$1'); // Remove BibTeX braces
  }

  // Format date from citation-js date structure
  formatDate(issued?: {['date-parts']: number[][]}): string {
    if (!issued || !issued['date-parts'] || !issued['date-parts'][0]) {
      return "";
    }
    
    const dateParts = issued['date-parts'][0];
    const year = dateParts[0];
    const month = dateParts[1];
    
    if (month) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${monthNames[month - 1]} ${year}`;
    }
    
    return year.toString();
  }

  // Format entry for bibliography
  formatEntry(entry: BibEntry): string {
    const type = entry.type.toLowerCase();
    
    switch (type) {
      case 'article':
        return this.formatArticle(entry);
      case 'book':
        return this.formatBook(entry);
      case 'inproceedings':
      case 'conference':
        return this.formatInProceedings(entry);
      case 'incollection':
        return this.formatInCollection(entry);
      default:
        console.warn(`Unsupported entry type: ${type}, falling back to article format`);
        return this.formatArticle(entry);
    }
  }

  private formatArticle(entry: BibEntry): string {
    const parts: string[] = [];
    
    // Authors
    if (entry.author) {
      parts.push(this.formatAuthors(entry.author));
    }
    
    // Title
    if (entry.title) {
      parts.push(this.formatTitle(entry.title));
    }
    
    // Journal info
    if (entry['container-title']) {
      let journalPart = `*${entry['container-title']}*`; // Markdown emphasis
      
      // Volume and issue
      if (entry.volume) {
        journalPart += ` ${entry.volume}`;
        if (entry.issue) {
          journalPart += `(${entry.issue})`;
        }
      }
      
      // Pages
      if (entry.page) {
        journalPart += `:${entry.page.replace(/-+/g, "–")}`;
      }
      
      parts.push(journalPart);
    }
    
    // Date
    if (entry.issued) {
      parts.push(this.formatDate(entry.issued));
    }
    
    return parts.join(", ") + ".";
  }

  private formatBook(entry: BibEntry): string {
    const parts: string[] = [];
    
    // Authors or editors
    if (entry.author) {
      parts.push(this.formatAuthors(entry.author));
    } else if (entry.editor) {
      const editors = this.formatAuthors(entry.editor);
      const suffix = entry.editor.length > 1 ? "editors" : "editor";
      parts.push(`${editors}, ${suffix}`);
    }
    
    // Title (emphasized)
    if (entry.title) {
      parts.push(`*${this.formatTitle(entry.title)}*`);
    }
    
    // Publisher and place
    const pubInfo: string[] = [];
    if (entry['publisher-place']) {
      pubInfo.push(entry['publisher-place']);
    }
    if (entry.publisher) {
      pubInfo.push(entry.publisher);
    }
    if (pubInfo.length > 0) {
      parts.push(pubInfo.join(": "));
    }
    
    // Date
    if (entry.issued) {
      parts.push(this.formatDate(entry.issued));
    }
    
    return parts.join(", ") + ".";
  }

  private formatInProceedings(entry: BibEntry): string {
    const parts: string[] = [];
    
    // Authors
    if (entry.author) {
      parts.push(this.formatAuthors(entry.author));
    }
    
    // Title
    if (entry.title) {
      parts.push(this.formatTitle(entry.title));
    }
    
    // Booktitle
    if (entry['container-title']) {
      let proceedingsPart = `In *${entry['container-title']}*`;
      
      // Pages
      if (entry.page) {
        proceedingsPart += `, pages ${entry.page.replace(/-+/g, "–")}`;
      }
      
      parts.push(proceedingsPart);
    }
    
    // Date
    if (entry.issued) {
      parts.push(this.formatDate(entry.issued));
    }
    
    return parts.join(", ") + ".";
  }

  private formatInCollection(entry: BibEntry): string {
    // Similar to inproceedings but for book chapters
    return this.formatInProceedings(entry);
  }

  // Generate complete bibliography
  processBibliography(entries: BibEntry[]): Array<{label: string, formatted: string, sortKey: string, originalId: string}> {
    const formattedEntries = entries.map(entry => {
      const label = this.generateAlphaLabel(entry);
      const formatted = this.formatEntry(entry);
      const sortKey = this.generateSortKey(entry, label);
      
      return { label, formatted, sortKey, originalId: entry.id, entry };
    });

    // Handle duplicate labels (add 'a', 'b', etc.)
    const labelCounts: {[key: string]: number} = {};
    const finalEntries = formattedEntries.map(({label, formatted, sortKey, originalId, entry}) => {
      if (labelCounts[label]) {
        labelCounts[label]++;
        const suffix = String.fromCharCode(96 + labelCounts[label]); // 'a', 'b', 'c'...
        return {
          label: label + suffix,
          formatted,
          sortKey: sortKey + suffix,
          originalId
        };
      } else {
        labelCounts[label] = 1;
        return { label, formatted, sortKey, originalId };
      }
    });

    // Sort by sort key
    finalEntries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    
    // Cache citations
    for (const entry of finalEntries) {
      this.citationCache.set(entry.originalId, entry.label);
    }
    
    this.bibliographyEntries = finalEntries;
    return finalEntries;
  }

  private generateSortKey(entry: BibEntry, label: string): string {
    // Simplified sort key for alpha style
    const authorSort = entry.author ? 
      entry.author[0].family || entry.author[0].literal || "" : 
      (entry.editor ? entry.editor[0].family || entry.editor[0].literal || "" : "");
    
    const year = entry.issued?.['date-parts']?.[0]?.[0] || 9999;
    const title = entry.title || "";
    
    return `${label}_${authorSort}_${year}_${title}`;
  }

  // Get citation label for a given cite key
  getCitationLabel(citeKey: string): string | undefined {
    return this.citationCache.get(citeKey);
  }

  // Generate bibliography page content
  generateBibliographyMarkdown(title: string = "Bibliography"): string {
    let output = `# ${title}\n\n`;
    
    for (const {label, formatted} of this.bibliographyEntries) {
      output += `<div id="${label.toLowerCase()}" class="bib-entry">\n`;
      output += `**[${label}]** ${formatted}\n`;
      output += `</div>\n\n`;
    }
    
    return output;
  }
}

export const AlphaCitations: QuartzTransformerPlugin<AlphaCitationsOptions | undefined> = (userOpts) => {
  const opts: AlphaCitationsOptions = {
    bibFile: "references.bib",
    generateBibliographyPage: true,
    bibliographyTitle: "Bibliography",
    linkCitations: true,
    ...userOpts,
  }

  return {
    name: "AlphaCitations",
    markdownPlugins() {
      return []
    },
    htmlPlugins() {
      return []
    },
    externalResources() {
      return {}
    },
    async process(processor, ctx) {
      const alphaGen = new AlphaStyleGenerator();
      let bibEntries: BibEntry[] = [];
      
      // Try to load and parse the bibliography file
      if (opts.bibFile) {
        try {
          const bibPath = path.join(ctx.cfg.configuration.contentDir || "content", opts.bibFile);
          if (fs.existsSync(bibPath)) {
            const bibContent = fs.readFileSync(bibPath, 'utf-8');
            bibEntries = alphaGen.parseBibFile(bibContent);
            alphaGen.processBibliography(bibEntries);
            console.log(`Loaded ${bibEntries.length} bibliography entries for alpha citations`);
            
            // Generate bibliography page if requested
            if (opts.generateBibliographyPage) {
              const bibliographyMarkdown = alphaGen.generateBibliographyMarkdown(opts.bibliographyTitle);
              const bibliographyPath = path.join(ctx.cfg.configuration.contentDir || "content", "bibliography.md");
              fs.writeFileSync(bibliographyPath, bibliographyMarkdown);
              console.log(`Generated bibliography page at ${bibliographyPath}`);
            }
          } else {
            console.warn(`Bibliography file not found: ${bibPath}`);
          }
        } catch (error) {
          console.error(`Error loading bibliography file: ${error}`);
        }
      }

      // Return a remark plugin that processes citations in markdown
      return () => {
        return (tree: Root, file) => {
          if (bibEntries.length === 0) return;

          // Process citation patterns like [@citekey] or [citekey]
          visit(tree, 'text', (node: any) => {
            if (!node.value) return;
            
            // Match patterns like [@citekey], [citekey], or [@citekey1; citekey2]
            const citationRegex = /\[(@?)([^\]]+)\]/g;
            
            node.value = node.value.replace(citationRegex, (match: string, at: string, keys: string) => {
              const citeKeys = keys.split(/[;,]/).map(k => k.trim().replace(/^@/, ''));
              
              if (opts.linkCitations) {
                const links = citeKeys.map(key => {
                  const label = alphaGen.getCitationLabel(key);
                  if (label) {
                    return `[${label}](#${label.toLowerCase()})`;
                  } else {
                    console.warn(`Citation not found: ${key}`);
                    return `[${key}]`;
                  }
                });
                return `[${links.join(', ')}]`;
              } else {
                const labels = citeKeys.map(key => {
                  const label = alphaGen.getCitationLabel(key);
                  return label || key;
                });
                return `[${labels.join(', ')}]`;
              }
            });
          });

          // Also process paragraph nodes
          visit(tree, 'paragraph', (node: any) => {
            visit(node, 'text', (textNode: any) => {
              if (!textNode.value) return;
              
              const citationRegex = /\[(@?)([^\]]+)\]/g;
              
              textNode.value = textNode.value.replace(citationRegex, (match: string, at: string, keys: string) => {
                const citeKeys = keys.split(/[;,]/).map(k => k.trim().replace(/^@/, ''));
                
                if (opts.linkCitations) {
                  const links = citeKeys.map(key => {
                    const label = alphaGen.getCitationLabel(key);
                    if (label) {
                      return `[${label}](#${label.toLowerCase()})`;
                    } else {
                      console.warn(`Citation not found: ${key}`);
                      return `[${key}]`;
                    }
                  });
                  return `[${links.join(', ')}]`;
                } else {
                  const labels = citeKeys.map(key => {
                    const label = alphaGen.getCitationLabel(key);
                    return label || key;
                  });
                  return `[${labels.join(', ')}]`;
                }
              });
            });
          });
        }
      }
    }
  } satisfies QuartzTransformerPluginInstance<AlphaCitationsOptions | undefined>
}
