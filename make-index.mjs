// Generate and validate the format-1 market index for this repository.
import { parseMarketIndex } from './.tools/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js'
import { readFileSync, writeFileSync } from 'node:fs'

const commit = process.argv[2]
if (!/^[0-9a-f]{40}$/.test(commit ?? '')) throw new Error('usage: node make-index.mjs <40-hex commit>')

const INDEX_URL = 'https://raw.githubusercontent.com/xypshot/dsh-plugins/main/index.json'
const pkg = JSON.parse(readFileSync('plugins/llm-quota-board/package.json', 'utf8'))

const index = {
  format: 1,
  title: { en: "xypshot's DSH Plugins", zh: 'xypshot 的 DSH 插件' },
  description: {
    en: 'Plugins for DeepSeek Harness maintained by xypshot.',
    zh: 'xypshot 维护的 DeepSeek Harness 插件合集。',
  },
  plugins: [
    {
      name: pkg.name,
      title: { en: 'Quota Overview', zh: '额度总览' },
      description: {
        en: pkg.description,
        zh: '查看设置 → 模型中已部署的全部供应商和模型的余额与额度。',
      },
      icon: 'plugins/llm-quota-board/icon.svg',
      author: 'xypshot',
      homepage: 'https://github.com/xypshot/dsh-plugins',
      repository: {
        url: 'https://github.com/xypshot/dsh-plugins/',
        directory: 'plugins/llm-quota-board',
      },
      metadata: {
        keywords: ['quota', 'llm', 'models', '额度', '配额'],
      },
      versions: [
        {
          version: pkg.version,
          publishTimestamp: Math.floor(Date.now() / 1000),
          source: {
            type: 'git',
            url: 'https://github.com/xypshot/dsh-plugins/',
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
