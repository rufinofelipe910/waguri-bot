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
    return conn.reply(m.chat, `❏ Uso correcto: *.claim <id>*\n\n📍 El ID aparece cuando usas *.rw*`, m, global.rcanal)
  }

  try {
    const characters = await loadCharacters()
    const character = characters.find(c => c.id === id)

    if (!character) {
      return conn.reply(m.chat, `❏ No existe ningún personaje con el ID *${id}*.`, m, global.rcanal)
    }

    if (character.user) {
      return conn.reply(m.chat, character.user === m.sender
        ? `❏ Ya tienes a *${character.name}* en tu harem.`
        : `❏ *${character.name}* ya fue reclamado por otro usuario.`, m, global.rcanal)
    }

    const user = global.db.data.users[m.sender]

    if (user.coin < character.value) {
      return conn.reply(m.chat, `💸 No tienes suficientes ${global.moneda || 'WaguriCoins'}.\n\n💰 Necesitas: *${character.value}*\n🪙 Tienes: *${user.coin}*`, m, global.rcanal)
    }

    user.coin -= character.value
    character.user = m.sender

    await saveCharacters(characters)

    conn.reply(m.chat, `🎉 ¡Reclamaste a *${character.name}*!\n\n💖 Ahora es parte de tu harem. Usa *.harem* para verla.`, m, global.rcanal)

  } catch (error) {
    conn.reply(m.chat, `✘ Error: ${error.message}`, m, global.rcanal)
  }
}

handler.help = ['claim']
handler.tags = ['gacha']
handler.command = ['claim']
handler.group = true
handler.register = true

export default handler
