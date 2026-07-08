import fetch from 'node-fetch'
import { nombreesWaifu } from './nombres-waifu.js'

let cooldowns = {}
global.waifuOffers = global.waifuOffers || {}

const rarezas = [
  { nombre: 'Común', emoji: '⚪', min: 500, max: 1500, peso: 50 },
  { nombre: 'Rara', emoji: '🔵', min: 1500, max: 4000, peso: 30 },
  { nombre: 'Épica', emoji: '🟣', min: 4000, max: 8000, peso: 15 },
  { nombre: 'Legendaria', emoji: '🟡', min: 8000, max: 15000, peso: 5 }
]

function elegirRareza() {
  let total = rarezas.reduce((a, r) => a + r.peso, 0)
  let rand = Math.random() * total
  for (let r of rarezas) {
    if (rand < r.peso) return r
    rand -= r.peso
  }
  return rarezas[0]
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

let handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()
  const cooldownTime = 15 * 60 * 1000 // 15 minutos

  if (cooldowns[userId] && now < cooldowns[userId]) {
    const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60

    return await conn.reply(
      m.chat,
      `《✧》Debes esperar *${minutes} minutos ${seconds} segundos* para usar *.rw* de nuevo.`,
      m,
      global.rcanal
    )
  }

  try {
    // Buscar imagen de Danbooru con rating general
    let res = await fetch('https://danbooru.donmai.us/posts.json?tags=rating:general&random=true&limit=1')
    let json = await res.json()

    if (!json || !json[0]) {
      return conn.reply(m.chat, `❌ No pude conectar con Danbooru. Intenta de nuevo.`, m, global.rcanal)
    }

    let post = json[0]
    let imagen = post.file_url || post.large_file_url || null

    if (!imagen) {
      return conn.reply(m.chat, `❌ La imagen no está disponible. Intenta de nuevo.`, m, global.rcanal)
    }

    let rareza = elegirRareza()
    let precio = Math.floor(Math.random() * (rareza.max - rareza.min + 1)) + rareza.min
    let nombre = pickRandom(nombreesWaifu)
    let offerId = post.id

    let caption = `🌸 *¡Una waifu salvaje apareció!* 🌸\n\n👤 Nombre: *${nombre}*\n${rareza.emoji} Rareza: *${rareza.nombre}*\n💰 Precio: *${precio}* ${global.moneda || 'WaguriCoins'}\n\n✨ Usa *.claim ${offerId}* para agregarla a tu harem.\n⌛ Oferta válida por 15 minutos.`

    let sent = await conn.sendFile(m.chat, imagen, 'waifu.jpg', caption, m)

    global.waifuOffers[offerId] = {
      nombre,
      rareza: rareza.nombre,
      emoji: rareza.emoji,
      precio,
      imagen,
      expira: now + cooldownTime,
      danbooru_id: post.id
    }

    cooldowns[userId] = now

  } catch (e) {
    console.log('Error en rw:', e)
    conn.reply(m.chat, `✘ Error al invocar waifu: ${e.message}`, m, global.rcanal)
  }
}

handler.help = ['rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['rw', 'rollwaifu']
handler.group = true
handler.register = true

export default handler
