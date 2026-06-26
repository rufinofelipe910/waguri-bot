
// código creado por Rufino

import fetch from 'node-fetch'

const API_KEY   = 'NEX-83D0B5F2BEE5455690F53156'
const API_BASE  = 'https://nexevo.boxmine.xyz/ai/flux'
const channelId  = '120363423258391692@newsletter'
const channelName = '🌸❖𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧❖🌸'

const newsletterCtx = {
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: channelId,
    newsletterName: channelName,
    serverMessageId: -1
  }
}

const handler = async (m, { conn, text }) => {
  try {
    if (!text?.trim()) {
      return conn.sendMessage(m.chat, {
        text:
          `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
          `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
          `🖼️ Ingresa una descripción\n` +
          `para generar tu imagen ~\n\n` +
          `💖 *Ejemplo:*\n` +
          `› flux un gato en el espacio\n` +
          `› flux chica anime con cabello rosa\n\n` +
          `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑`,
        contextInfo: newsletterCtx
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      react: { text: '🎨', key: m.key }
    })

    await conn.sendMessage(m.chat, {
      text:
        `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
        `🎨 Generando tu imagen~\n` +
        `✨ *${text}*\n\n` +
        `Por favor espera un momento 🌸\n\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑`,
      contextInfo: newsletterCtx
    }, { quoted: m })

    const url = `${API_BASE}?prompt=${encodeURIComponent(text)}&apikey=${API_KEY}`
    const res = await fetch(url, { timeout: 60000 })

    if (!res.ok) throw new Error(`La API respondió con status ${res.status}`)

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('image')) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.message || json?.error || 'La API no devolvió una imagen')
    }

    const buffer = Buffer.from(await res.arrayBuffer())

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption:
        `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
        `✅ *¡Imagen generada!* 🌸\n\n` +
        `💖 *Prompt:*\n` +
        `🌈 ${text}\n\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑`,
      contextInfo: { mentionedJid: [m.sender], ...newsletterCtx }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    console.error('Error en flux:', e)
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    })
    conn.sendMessage(m.chat, {
      text:
        `✿°• 𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧 •°✿\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n\n` +
        `❌ Ocurrió un error~\n` +
        `⚠️ ${e.message}\n\n` +
        `⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑`,
      contextInfo: newsletterCtx
    }, { quoted: m })
  }
}

handler.help = ['flux <descripción>']
handler.tags = ['ia']
handler.command = ['flux', 'imagine', 'gen']
handler.group = true
handler.register = true

export default handler
