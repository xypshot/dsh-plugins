// ASCII-only rename helper.
import fs from 'node:fs'

const base = 'plugins/llm-quota-board/'
const edit = (file, from, to) => {
  let text = fs.readFileSync(base + file, 'utf8')
  if (!text.includes(from)) throw new Error(`pattern not found in ${file}: ${from}`)
  text = text.split(from).join(to)
  fs.writeFileSync(base + file, text, 'utf8')
}

edit('package.json', '"name": "dsh-quota"', '"name": "edu"')
edit('cordis.patch.yml', 'dsh-quota', 'edu')
edit('client.js', "id: 'dsh-quota'", "id: 'edu'")

JSON.parse(fs.readFileSync(base + 'package.json', 'utf8'))
const zh = fs.readFileSync(base + 'locale/zh.json', 'utf8')
if (!zh.includes('额度总览')) throw new Error('encoding check failed on zh locale')
console.log('rename to edu OK, UTF-8 intact')
