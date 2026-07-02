// código creado por Rufino

import fetch from 'node-fetch'
import { Readable } from 'stream'

let handler = async (m, { conn }) => {
  if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
    return m.reply('💖 Responde a una imagen con este comando~\n\n🌈 Ejemplo: responde a una foto y escribe /.cdn')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⌚', key: m.key } })

    const media = await conn.downloadM(m.quoted)

    if (!media) throw new Error('No pude descargar la imagen')

    const res = await fetch('https://transfer.sh/', {
      method: 'POST',
      body: media,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    })

    const url = await res.text()

    if (!url || !url.startsWith('http')) throw new Error('El CDN no devolvió una URL válida')

    await conn.sendMessage(m.chat, {
      text:
        `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
        `✅ *¡Imagen subida\\!* 🌸\n\n` +
        `🔗 *URL pública:*\n` +
        `${url.trim()}\n\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('Error en CDN:', e)
    await conn.sendMessage(m.chat, {
      text:
        `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
        `❌ Error subiendo imagen~\n` +
        `⚠️ ${e.message}\n\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑`
    }, { quoted: m })
  }
}

handler.help = ['cdn']
handler.tags = ['tools']
handler.command = ['cdn', 'upload']
handler.group = true

export default handler