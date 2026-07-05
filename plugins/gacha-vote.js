import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'
const voteLogPath = './lib/votelog.json'

async function loadCharacters() {
  try {
    const data = await fs.readFile(charactersFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error('No se pudo cargar el archivo characters.json.')
  }
}

async function saveCharacters(characters) {
  try {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2))
  } catch (error) {
    throw new Error('No se pudo guardar el archivo characters.json.')
  }
}

async function loadVoteLog() {
  try {
    const data = await fs.readFile(voteLogPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveVoteLog(log) {
  await fs.writeFile(voteLogPath, JSON.stringify(log, null, 2))
}

let cooldowns = new Map()
let characterVotes = new Map()

let handler = async (m, { conn, args }) => {
  try {
    const userId = m.sender
    const cooldownTime = 60 * 60 * 1000 // 1 hora

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + cooldownTime
      const now = Date.now()
      if (now < expirationTime) {
        const timeLeft = expirationTime - now
        const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
        const seconds = Math.floor((timeLeft / 1000) % 60)
        return conn.reply(m.chat, `《✧》Debes esperar *${minutes} minutos ${seconds} segundos* para usar *.vote* de nuevo.`, m, global.rcanal)
      }
    }

    const characters = await loadCharacters()
    const characterName = args.join(' ')

    if (!characterName) {
      return conn.reply(m.chat, `《✧》Uso correcto: *.vote <nombre del personaje>*\n\n📍 El nombre debe coincidir con el que aparece en *.rw* o *.harem*.`, m, global.rcanal)
    }

    const character = characters.find(c => c.name.toLowerCase() === characterName.toLowerCase())

    if (!character) {
      return conn.reply(m.chat, `《✧》Personaje no encontrado. Verifica que el nombre esté escrito igual que en el bot.`, m, global.rcanal)
    }

    if (characterVotes.has(character.name) && Date.now() < characterVotes.get(character.name)) {
      const expirationTime = characterVotes.get(character.name)
      const timeLeft = expirationTime - Date.now()
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
      const seconds = Math.floor((timeLeft / 1000) % 60)
      return conn.reply(m.chat, `《✧》El personaje *${character.name}* ya fue votado recientemente. Espera *${minutes} minutos ${seconds} segundos* para volver a votarlo.`, m, global.rcanal)
    }

    if (!character.votes) character.votes = 0

    const incrementValue = Math.floor(Math.random() * 10) + 1
    character.value = character.value + incrementValue
    character.votes += 1

    await saveCharacters(characters)

    const log = await loadVoteLog()
    const entry = log.find(e => e.userId === userId && e.characterId === character.id)

    if (!entry) {
      log.push({ userId, characterId: character.id, lastVoteTime: Date.now() })
    } else {
      entry.lastVoteTime = Date.now()
    }
    await saveVoteLog(log)

    cooldowns.set(userId, Date.now())
    characterVotes.set(character.name, Date.now() + cooldownTime)

    conn.reply(m.chat, `✰ Votaste por *${character.name}*\n\n💰 Nuevo valor: *${character.value}* ${global.moneda || 'WaguriCoins'} (+${incrementValue})\n📊 Total de votos: *${character.votes}*`, m, global.rcanal)

  } catch (e) {
    conn.reply(m.chat, `✘ Error al procesar el voto: ${e.message}`, m, global.rcanal)
  }
}

handler.help = ['vote']
handler.tags = ['gacha']
handler.command = ['vote', 'votar']
handler.group = true
handler.register = true

export default handler
