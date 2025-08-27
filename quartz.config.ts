import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "igodlab",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "igodlab.com",
    ignorePatterns: [
      "private", 
      "templates", 
      ".obsidian",
      "**.zip",
      "**.epub",
      "**.docx",
      "__pycache__",
    ],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#eff1f5",        // Catppuccin Latte base
          lightgray: "#e6e9ef",    // Catppuccin Latte mantle
          gray: "#9ca0b0",         // Catppuccin Latte overlay0
          darkgray: "#4c4f69",     // Catppuccin Latte text
          dark: "#4c4f69",         // Catppuccin Latte text
          secondary: "#8839ef",     // Catppuccin Latte mauve
          tertiary: "#1e66f5",    // Catppuccin Latte blue
          highlight: "rgba(30, 102, 245, 0.15)",        // Latte blue with transparency
          textHighlight: "rgba(223, 142, 29, 0.3)",     // Latte yellow with transparency
        },
        darkMode: {
          light: "#303446",        // Catppuccin Frappe base
          lightgray: "#414559",    // Catppuccin Frappe surface0
          gray: "#737994",         // Catppuccin Frappe overlay0
          darkgray: "#c6d0f5",     // Catppuccin Frappe text
          dark: "#c6d0f5",         // Catppuccin Frappe text
          secondary: "#8caaee",    // Catppuccin Frappe blue
          tertiary: "#ca9ee6",     // Catppuccin Frappe mauve
          highlight: "rgba(140, 170, 238, 0.15)",       // Frappe blue with transparency
          textHighlight: "rgba(229, 200, 144, 0.3)",    // Frappe yellow with transparency
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "catppuccin-latte",
          dark: "tokyo-night",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      // HACK: enable custom Latex plugins for codeblock renders in *.md
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Pseudocode(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
