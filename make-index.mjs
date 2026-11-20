// Generate and validate the format-1 market index for this repository.
// Keep this file ASCII-only: PowerShell pipe I/O can mangle non-ASCII bytes.
import { parseMarketIndex } from './.tools/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js'
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const DEFAULT_COMMIT = undefined
const commit = process.env.IDX_COMMIT ?? process.argv[2] ?? DEFAULT_COMMIT
  ?? (() => execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim())()
if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('usage: node make-index.mjs <40-hex commit>')

const INDEX_URL = 'https://raw.githubusercontent.com/xypshot/dsh-plugins/main/index.json'
const pkg = JSON.parse(readFileSync('plugins/llm-quota-board/package.json', 'utf8'))

// zh: "xypshot \u7684 DSH \u63d2\u4ef6" etc., escaped to keep this file ASCII-only.
const index = {
  format: 1,
  title: { en: "xypshot's DSH Plugins", zh: 'xypshot \u7684 DSH \u63d2\u4ef6' },
  description: {
    en: 'Plugins for DeepSeek Harness maintained by xypshot.',
    zh: 'xypshot \u7ef4\u62a4\u7684 DeepSeek Harness \u63d2\u4ef6\u5408\u96c6\u3002',
  },
  plugins: [
    {
      name: pkg.name,
      title: { en: 'Quota Overview', zh: '\u989d\u5ea6\u603b\u89c8' },
      description: {
        en: pkg.description,
        zh: '\u67e5\u770b\u8bbe\u7f6e \u2192 \u6a21\u578b\u4e2d\u5df2\u90e8\u7f72\u7684\u5168\u90e8\u4f9b\u5e94\u5546\u548c\u6a21\u578b\u7684\u4f59\u989d\u4e0e\u989d\u5ea6\u3002',
      },
      icon: 'plugins/llm-quota-board/icon.svg',
      author: 'xypshot',
      homepage: 'https://github.com/xypshot/dsh-plugins',
      repository: {
        url: 'https://github.com/xypshot/dsh-plugins/',
        directory: 'plugins/llm-quota-board',
      },
      metadata: {
        keywords: ['quota', 'llm', 'models', '\u989d\u5ea6', '\u914d\u989d'],
      },
      versions: [
        {
          version: pkg.version,
          publishTimestamp: Math.floor(Date.now() / 1000),
          source: {
            type: 'git',
            url: 'https://github.com/xypshot/dsh-plugins.git',
            commit,
            path: 'plugins/llm-quota-board',
          },
          engines: { dsh: pkg.engines.dsh },
        },
      ],
    },
  ],
}

// Validate with the exact reader rules before publishing; throws MarketIndexError otherwise.
const validated = parseMarketIndex(index, INDEX_URL)
writeFileSync('index.json', JSON.stringify(validated, null, 2) + '\n')
console.log('index.json OK:', validated.plugins.length, 'plugin(s)')
