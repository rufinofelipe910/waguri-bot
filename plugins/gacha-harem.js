import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'

async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

let handler = async (m, { conn }) => {
  try {
    const characters = await loadCharacters()
    const mios = characters.filter(c => c.user === m.sender)

    if (!mios.length) {
      return conn.reply(m.chat, `🌸 Tu harem está vacío. Usa *.rw* para invocar un personaje y *.claim <id>* para reclamarlo.`, m, global.rcanal)
    }

    const total = mios.reduce((a, c) => a + c.value, 0)
    const lista = mios.map(c => `✦ *${c.id}* — *${c.name}* — 💰 ${c.value} ${global.moneda || 'WaguriCoins'} — ${c.source}`).join('\n')

    conn.reply(m.chat, `💖 *TU HAREM* (${mios.length}) 💖\n\n${lista}\n\n💰 Valor total: *${total}* ${global.moneda || 'WaguriCoins'}\n\n✨ Usa *.vender <id>* para vender un personaje.`, m, global.rcanal)

  } catch (error) {
    conn.reply(m.chat, `✘ Error: ${error.message}`, m, global.rcanal)
  }
}

handler.help = ['harem']
handler.tags = ['gacha']
handler.command = ['harem', 'miharem']
handler.group = true
handler.register = true

export default handler
