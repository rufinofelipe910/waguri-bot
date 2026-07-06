import { prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from "node-fetch"
import yts from 'yt-search'

const apikey = 'API_KEY_AQUI'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

function parseDuration(timestamp) {
  if (!timestamp || timestamp === 'N/A') return 0
  const parts = timestamp.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export default {
  command: ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4'],
  category: 'descargas',
  run: async (client, m, args, command) => {
    try {
      const text = args.join(' ')

      if (!text.trim()) return m.reply(`❍ Por favor, proporciona un nombre o enlace de YouTube`)

      let ytplay2 = null
      const isUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(text)

      if (isUrl) {
        try {
          const result = await yts(text)
          ytplay2 = result.all?.[0] || result.videos?.[0] || null
        } catch (_) {}

        if (!ytplay2 || !ytplay2.url) {
          ytplay2 = {
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
        ytplay2 = await yts(text)
        ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
        if (!ytplay2 || !ytplay2.url) return m.reply(`❍ No se encontraron resultados`)
      }

      let { title, thumbnail, timestamp, views, ago, url, author } = ytplay2
      const vistas    = formatViews(views)
      const canalLink = author?.url || 'Desconocido'
      const duracion  = parseDuration(timestamp)

      const infoMessage = `¡! ׂׂૢ *Download Youtube*
✩̣̣̣̣̣ͯ┄•͙✧⃝•͙┄✩ͯ•͙͙✧⃝•͙͙✩ͯ

❍ *Título* › *${title || 'Desconocido'}*
❍ *Vistas* › *${vistas}*
❍ *Duración* › *${timestamp}*
❍ *Publicado* › *${ago}*
❍ *Canal* › *${canalLink}*
❍ *Enlace* › *${url}*

──⇌••⇋──

${dev}`

      const prepared = thumbnail
        ? await prepareWAMessageMedia(
            { image: { url: thumbnail } },
            { upload: client.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
          )
        : null

      const image = prepared?.image || prepared?.imageMessage

      const linkPreview = url && thumbnail
        ? {
            'canonical-url':      url,
            'matched-text':       url,
            title:                title || botname,
            description:          dev,
            jpegThumbnail:        image?.jpegThumbnail ? Buffer.from(image.jpegThumbnail) : undefined,
            highQualityThumbnail: image || undefined
          }
        : undefined

      await client.sendMessage(m.chat, {
        text:        infoMessage.trim(),
        linkPreview,
        contextInfo: { mentionedJid: [] }
      }, { quoted: m })

      if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
        try {
          const api = await (await fetch(
            `https://api.alyacore.xyz/dl/ytmp3v2?url=${encodeURIComponent(url)}&key=${apikey}`
          )).json()

          if (!api.status || !api.data?.dl) throw new Error(api.message || 'La API no devolvió status=true')

          const dl       = api.data.dl
          const fileName = (api.data.title || 'audio') + '.mp3'

          if (duracion <= 3600) {
            await client.sendMessage(m.chat, {
              audio:    { url: dl },
              fileName: fileName,
              mimetype: 'audio/mpeg',
              ptt:      false
            }, { quoted: m })
          } else {
            await client.sendMessage(m.chat, {
              document: { url: dl },
              fileName: fileName,
              mimetype: 'audio/mpeg'
            }, { quoted: m })
          }

        } catch (e) {
          return m.reply(`❍ Error al descargar el audio`)
        }
      }

      else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
        await client.reply(m.chat, `❍ Descargando video en 480p...`, m)

        try {
          const api = await (await fetch(
            `https://api.alyacore.xyz/dl/ytmp4?url=${encodeURIComponent(url)}&quality=360&key=${apikey}`
          )).json()

          if (!api.status || !api.data?.dl) throw new Error(api.message || 'La API no devolvió status=true')

          const { title: fileTitle, dl, quality } = api.data

          await client.sendMessage(m.chat, {
            document: { url: dl },
            fileName: (fileTitle || `video_${quality || '360'}p`) + '.mp4',
            mimetype: 'video/mp4',
            caption:  `${dev}`
          }, { quoted: m })

        } catch (e) {
          console.error('Error en descarga de video:', e)
          return m.reply(`❍ Error al descargar el video`)
        }
      } else {
        return m.reply(`❍ Comando no reconocido`)
      }

    } catch (error) {
      return m.reply(`❍ Error: ${error.message}`)
    }
  },
}

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000)     return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000)         return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}
