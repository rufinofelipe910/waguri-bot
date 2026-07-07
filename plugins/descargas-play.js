import { prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from "node-fetch"
import yts from 'yt-search'

const apikey = 'api-uMZCY'

function parseDuration(timestamp) {
  if (!timestamp || timestamp === 'N/A') return 0
  const parts = timestamp.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000)     return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000)         return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(
        m.chat,
        `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 🎵 Ingresa el nombre o enlace\n│    del video que deseas ~\n│\n╰────────────────────`,
        m
      )
    }

    let ytplay = null
    const isUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(text)

    if (isUrl) {
      try {
        const result = await yts(text)
        ytplay = result.all?.[0] || result.videos?.[0] || null
      } catch (_) {}

      if (!ytplay || !ytplay.url) {
        ytplay = {
          url: text,
          title: 'Desconocido',
          thumbnail: '',
          timestamp: 'N/A',
          views: null,
          ago: 'N/A',
          author: { url: 'Desconocido' }
        }
      }
    } else {
      const result = await yts(text)
      ytplay = result.all?.[0] || result.videos?.[0] || null
      if (!ytplay || !ytplay.url) return conn.reply(
        m.chat,
        `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 🦋 No encontré resultados~\n│    Intenta con otro nombre\n│\n╰────────────────────`,
        m
      )
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = ytplay
    const vistas = formatViews(views)
    const canalLink = author?.url || 'Desconocido'
    const duracion = parseDuration(timestamp)
    const esVideo = ['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)

    const infoMessage = `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 🎬 *${title || 'Desconocido'}*\n│\n│ 👁️ Vistas   » *${vistas}*\n│ ⏳ Duración » *${timestamp}*\n│ 📅 Subido   » *${ago}*\n│ 📺 Canal    » *${canalLink}*\n│\n│ 📥 Procesando tu ${esVideo ? 'video 🎬' : 'audio 🎧'}~\n│    Por favor espera 💗\n│\n╰────────────────────`

    const prepared = thumbnail
      ? await prepareWAMessageMedia(
          { image: { url: thumbnail } },
          { upload: conn.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        )
      : null

    const image = prepared?.image || prepared?.imageMessage

    const linkPreview = url && thumbnail
      ? {
          'canonical-url':      url,
          'matched-text':       url,
          title:                title || 'WAGURI BOT',
          description:          '🌸 Waguri Bot',
          jpegThumbnail:        image?.jpegThumbnail ? Buffer.from(image.jpegThumbnail) : undefined,
          highQualityThumbnail: image || undefined
        }
      : undefined

    await conn.sendMessage(m.chat, {
      text: infoMessage.trim(),
      linkPreview,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: m })

    if (!esVideo) {
      try {
        const api = await (await fetch(
          `https://api.alyacore.xyz/dl/ytmp3v2?url=${encodeURIComponent(url)}&key=${apikey}`
        )).json()

        if (!api.status || !api.data?.dl) throw new Error(api.message || 'La API no devolvió status=true')

        const dl = api.data.dl
        const fileName = (api.data.title || 'audio') + '.mp3'

        if (duracion <= 3600) {
          await conn.sendMessage(m.chat, {
            audio: { url: dl },
            fileName: fileName,
            mimetype: 'audio/mpeg',
            ptt: false
          }, { quoted: m })
        } else {
          await conn.sendMessage(m.chat, {
            document: { url: dl },
            fileName: fileName,
            mimetype: 'audio/mpeg'
          }, { quoted: m })
        }

        await conn.reply(
          m.chat,
          `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ✅ *¡Listo!* Tu audio llegó ~\n│ 🌸 Disfrútalo mucho 💗\n│\n╰────────────────────`,
          m
        )

      } catch (e) {
        return conn.reply(
          m.chat,
          `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ❌ Error al descargar el audio~\n│ ⚠️ *${e.message}*\n│\n╰────────────────────`,
          m
        )
      }
    }

    else {
      try {
        const api = await (await fetch(
          `https://api.alyacore.xyz/dl/ytmp4?url=${encodeURIComponent(url)}&quality=360&key=${apikey}`
        )).json()

        if (!api.status || !api.data?.dl) throw new Error(api.message || 'La API no devolvió status=true')

        const { title: fileTitle, dl, quality } = api.data

        await conn.sendMessage(m.chat, {
          document: { url: dl },
          fileName: (fileTitle || `video_${quality || '360'}p`) + '.mp4',
          mimetype: 'video/mp4',
          caption: `🌸 Waguri Bot`
        }, { quoted: m })

        await conn.reply(
          m.chat,
          `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ✅ *¡Listo!* Tu video llegó ~\n│ 🌸 Disfrútalo mucho 💗\n│\n╰────────────────────`,
          m
        )

      } catch (e) {
        console.error('Error en descarga de video:', e)
        return conn.reply(
          m.chat,
          `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ❌ Error al descargar el video~\n│ ⚠️ *${e.message}*\n│\n╰────────────────────`,
          m
        )
      }
    }

  } catch (error) {
    return conn.reply(
      m.chat,
      `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ❌ Ocurrió un error~\n│ ⚠️ *${error.message}*\n│\n╰────────────────────`,
      m
    )
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'playaudio', 'play2', 'ytv', 'ytmp4', 'mp4']
handler.tags = ['descargas']
handler.group = true
handler.register = true

export default handler
