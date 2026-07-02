// código creado por Rufino

import fetch from 'node-fetch'
import FormData from 'form-data'
import { Readable } from 'stream'

let handler = async (m, { conn }) => {
  if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
    return m.reply('💖 Responde a una imagen con este comando~\n\n🌈 Ejemplo: responde a una foto y escribe /.up')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⌚', key: m.key } })

    const media = await conn.downloadMediaMessage(m.quoted)

    if (!media) throw new Error('No pude descargar la imagen')

    const form = new FormData()
    form.append('fileupload', Readable.from(media), { filename: 'image.jpg' })

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    })

    const url = await res.text()

    if (!url.startsWith('http')) throw new Error('El CDN no devolvió una URL válida')

    await conn.sendMessage(m.chat, {
      text:
        `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
        `✅ *¡Imagen subida\\!* 🌸\n\n` +
        `🔗 *URL pública:*\n` +
        `${url}\n\n` +
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

handler.help = ['up']
handler.tags = ['tools']
handler.command = ['cdn', 'upload']
handler.group = true

export default handler