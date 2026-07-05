import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'

async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

async function saveCharacters(characters) {
  await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2))
}

let handler = async (m, { conn, args }) => {
  const id = parseInt(args[0])

  if (!id) {
    return conn.reply(m.chat, `❏ Uso correcto: *.vender <id>*\n\n📍 Usa *.harem* para ver los IDs de tus personajes.`, m, global.rcanal)
  }

  try {
    const characters = await loadCharacters()
    const character = characters.find(c => c.id === id)

    if (!character || character.user !== m.sender) {
      return conn.reply(m.chat, `❏ No tienes ningún personaje con el ID *${id}* en tu harem.`, m, global.rcanal)
    }

    const reembolso = Math.floor(character.value * 0.5)
    const user = global.db.data.users[m.sender]

    character.user = null
    user.coin += reembolso

    await saveCharacters(characters)

    conn.reply(m.chat, `💸 Vendiste a *${character.name}* por *${reembolso}* ${global.moneda || 'WaguriCoins'} (50% de su valor).\n\n🔄 Ahora vuelve a estar disponible para que otros lo reclamen.`, m, global.rcanal)

  } catch (error) {
    conn.reply(m.chat, `✘ Error: ${error.message}`, m, global.rcanal)
  }
}

handler.help = ['vender']
handler.tags = ['gacha']
handler.command = ['vender', 'venderwaifu']
handler.group = true
handler.register = true

export default handler
