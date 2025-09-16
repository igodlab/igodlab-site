import Cite from '@citation-js/core'
import '@citation-js/plugin-bibtex'

// If you need to register the plugin explicitly:
// plugins.input.add('@bibtex/text', ...)

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

class AlphaStyleGenerator {
  private etAlCharUsed = false;
  
  constructor() {
    // Initialize citation-js if needed
  }

  // Parse .bib file using citation-js
  async parseBibFile(bibContent: string): Promise<BibEntry[]> {
    try {
      const cite = new Cite(bibContent, { forceType: '@bibtex/text' });
      const entries = cite.data as BibEntry[];
      
      console.log('Parsed entries:', entries.length);
      console.log('Sample entry:', entries[0]); // Debug: see the structure
      
      return entries;
    } catch (error) {
      console.error('Error parsing BibTeX file:', error);
      throw error;
    }
  }

  // Alternative: load from file path (Node.js)
  async parseBibFromFile(filePath: string): Promise<BibEntry[]> {
    const fs = await import('fs/promises');
    const bibContent = await fs.readFile(filePath, 'utf-8');
    return this.parseBibFile(bibContent);
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

  // Format pages with proper en-dashes
  formatPages(pages?: string): string {
    if (!pages) return "";
    
    const hasRange = /[-–—]/.test(pages) || /,/.test(pages) || /\+/.test(pages);
    const label = hasRange ? "pages" : "page";
    const formattedPages = pages.replace(/-+/g, "–"); // Convert to en-dash
    
    return `${label} ${formattedPages}`;
  }

  // Generate bibliography entry for different types
  formatEntry(entry: BibEntry, label: string): string {
    const type = entry.type.toLowerCase();
    
    switch (type) {
      case 'article':
        return this.formatArticle(entry, label);
      case 'book':
        return this.formatBook(entry, label);
      case 'inproceedings':
      case 'conference':
        return this.formatInProceedings(entry, label);
      case 'incollection':
        return this.formatInCollection(entry, label);
      default:
        console.warn(`Unsupported entry type: ${type}, falling back to article format`);
        return this.formatArticle(entry, label);
    }
  }

  private formatArticle(entry: BibEntry, label: string): string {
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

  private formatBook(entry: BibEntry, label: string): string {
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

  private formatInProceedings(entry: BibEntry, label: string): string {
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

  private formatInCollection(entry: BibEntry, label: string): string {
    // Similar to inproceedings but for book chapters
    return this.formatInProceedings(entry, label);
  }

  // Generate complete bibliography
  generateBibliography(entries: BibEntry[]): Array<{label: string, formatted: string, sortKey: string}> {
    const formattedEntries = entries.map(entry => {
      const label = this.generateAlphaLabel(entry);
      const formatted = this.formatEntry(entry, label);
      const sortKey = this.generateSortKey(entry, label);
      
      return { label, formatted, sortKey, entry };
    });

    // Handle duplicate labels (add 'a', 'b', etc.)
    const labelCounts: {[key: string]: number} = {};
    const finalEntries = formattedEntries.map(({label, formatted, sortKey, entry}) => {
      if (labelCounts[label]) {
        labelCounts[label]++;
        const suffix = String.fromCharCode(96 + labelCounts[label]); // 'a', 'b', 'c'...
        return {
          label: label + suffix,
          formatted,
          sortKey: sortKey + suffix
        };
      } else {
        labelCounts[label] = 1;
        return { label, formatted, sortKey };
      }
    });

    // Sort by sort key
    finalEntries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    
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

  // Generate Markdown output suitable for Quartz
  generateMarkdownBibliography(entries: BibEntry[]): string {
    const bibliography = this.generateBibliography(entries);
    
    let output = "## Bibliography\n\n";
    
    for (const {label, formatted} of bibliography) {
      // Use label as anchor for citations
      output += `<div id="${label.toLowerCase()}" class="bib-entry">\n`;
      output += `**[${label}]** ${formatted}\n`;
      output += `</div>\n\n`;
    }
    
    return output;
  }

  // Generate citation links for use in text
  generateCitations(entries: BibEntry[]): {[key: string]: string} {
    const bibliography = this.generateBibliography(entries);
    const citations: {[key: string]: string} = {};
    
    for (const {label, entry} of bibliography as any[]) {
      // Map original cite key to alpha label
      citations[entry.entry.id] = `[${label}](#${label.toLowerCase()})`;
    }
    
    return citations;
  }
}

// Example usage for your Quartz site
export async function setupAlphaCitations(bibFilePath: string) {
  const alphaGen = new AlphaStyleGenerator();
  
  try {
    // Parse your .bib file
    const entries = await alphaGen.parseBibFromFile(bibFilePath);
    console.log(`Loaded ${entries.length} bibliography entries`);
    
    // Generate bibliography
    const markdown = alphaGen.generateMarkdownBibliography(entries);
    
    // Generate citation lookup
    const citations = alphaGen.generateCitations(entries);
    
    return { markdown, citations, entries };
  } catch (error) {
    console.error('Failed to setup alpha citations:', error);
    throw error;
  }
}

// For browser usage (if loading .bib content directly)
export async function setupAlphaCitationsFromContent(bibContent: string) {
  const alphaGen = new AlphaStyleGenerator();
  
  const entries = await alphaGen.parseBibFile(bibContent);
  const markdown = alphaGen.generateMarkdownBibliography(entries);
  const citations = alphaGen.generateCitations(entries);
  
  return { markdown, citations, entries };
}
