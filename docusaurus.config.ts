import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

export default async function createConfig(): Promise<Config> {
  const remarkMath = (await import('remark-math')).default
  const rehypeKatex = (await import('rehype-katex')).default

  return {
    title: 'pemako.cn',
    tagline: '技术笔记',
    favicon: 'img/favicon.ico',

    future: {
      v4: true,
    },

    url: 'https://pemako.github.io',
    baseUrl: '/',

    organizationName: 'pemako',
    projectName: 'pemako.github.io',

    onBrokenLinks: 'warn',

    markdown: {
      format: 'detect',
      mermaid: true,
      hooks: {
        onBrokenMarkdownImages: 'warn',
      },
    },

    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
        type: 'text/css',
        crossorigin: 'anonymous',
      },
    ],

    i18n: {
      defaultLocale: 'zh-Hans',
      locales: ['zh-Hans'],
    },

    themes: [
      '@docusaurus/theme-mermaid',
    ],

    presets: [
      [
        'classic',
        {
          docs: {
            sidebarPath: './sidebars.ts',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
          },
          blog: {
            showReadingTime: true,
            blogSidebarCount: 'ALL',
            blogSidebarTitle: '全部文章',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
            feedOptions: {
              type: ['rss', 'atom'],
              xslt: true,
            },
            onInlineTags: 'warn',
            onInlineAuthors: 'warn',
            onUntruncatedBlogPosts: 'warn',
          },
          theme: {
            customCss: './src/css/custom.css',
          },
        } satisfies Preset.Options,
      ],
    ],

    themeConfig: {
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'pemako.cn',
        logo: {
          alt: 'pemako.cn Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          { to: '/blog', label: '博客', position: 'left' },
          {
            href: 'https://github.com/pemako',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: {
        appId: 'Y9XSC9L6NU',
        apiKey: '3dac86dfbd55883ff6387b1c10c7872d',
        indexName: 'pemakocn',
      },
    } satisfies Preset.ThemeConfig,
  }
}
