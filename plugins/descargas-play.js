// código creado por Rufino

import fs from "fs"
import path from "path"
import fetch from "node-fetch"
import yts from "yt-search"

const API_KEY = "api-uMZCY"
const API_BASE = "https://api.alyacore.xyz/dl/youtubeplayv2"

// Guarda las sesiones de espera de respuesta (chat+usuario -> datos del video)
const pendingChoices = new Map()

const fetchWithTimeout = (url, ms = 20000) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout))
}

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(
        m.chat,
        `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 🎵 Ingresa el nombre o enlace\n│    del video que deseas ~\n│\n╰────────────────────`,
        m
      )
    }

    const videoIdMatch = text.match(youtubeRegexID)
    let ytSearch = null

    if (videoIdMatch) {
      ytSearch = await yts({ videoId: videoIdMatch[1] })
    } else {
      const result = await yts(text)
      ytSearch = result.videos?.[0]
    }

    if (!ytSearch?.title) return conn.reply(
      m.chat,
      `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 🦋 No encontré resultados~\n│    Intenta con otro nombre\n│\n╰────────────────────`,
      m
    )

    const { title, thumbnail, timestamp, views, ago, url } = ytSearch
    const vistas = formatViews(views)

    const sentMsg = await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 🎬 *${title}*\n│\n│ 👁️ Vistas   » *${vistas}*\n│ ⏳ Duración » *${timestamp}*\n│ 📅 Subido   » *${ago}*\n│\n│ 📌 ¿En qué formato lo quieres?\n│\n│ 1️⃣ Responde *1* para 🎧 MP3\n│ 2️⃣ Responde *2* para 🎬 MP4\n│\n│ ⏱️ Tienes 60 segundos para elegir~\n│\n╰────────────────────`,
        contextInfo: {
          mentionedJid: [m.sender]
        }
      },
      { quoted: m }
    )

    const sessionKey = m.chat + m.sender
    const previous = pendingChoices.get(sessionKey)
    if (previous) clearTimeout(previous.timeoutId)

    const timeoutId = setTimeout(() => {
      const session = pendingChoices.get(sessionKey)
      if (session) {
        pendingChoices.delete(sessionKey)
        conn.reply(
          m.chat,
          `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ⌛ Se acabó el tiempo~\n│    Usa el comando de nuevo\n│\n╰────────────────────`,
          m
        )
      }
    }, 60000)

    pendingChoices.set(sessionKey, {
      title, thumbnail, timestamp, views, ago, url,
      timeoutId,
      quoted: m
    })

  } catch (e) {
    conn.reply(
      m.chat,
      `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ❌ Ocurrió un error~\n│ ⚠️ *${e.message}*\n│\n╰────────────────────`,
      m
    )
  }
}

handler.command = handler.help = ["play", "yta", "ytmp3", "playaudio", "play2", "ytv", "ytmp4"]
handler.tags = ["descargas"]
handler.group = true
handler.register = true

// --- Handler que escucha la respuesta del usuario (1 o 2) ---
handler.before = async (m, { conn }) => {
  const sessionKey = m.chat + m.sender
  const session = pendingChoices.get(sessionKey)
  if (!session) return

  const body = (m.text || "").trim().toLowerCase()
  const isAudio = ["1", "mp3", "audio"].includes(body)
  const isVideo = ["2", "mp4", "video"].includes(body)

  if (!isAudio && !isVideo) return

  clearTimeout(session.timeoutId)
  pendingChoices.delete(sessionKey)

  const type = isAudio ? "audio" : "video"
  const { title, url } = session
  const tmpFiles = []

  try {
    await conn.reply(
      m.chat,
      `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ 📥 Procesando tu ${type === "audio" ? "audio 🎧" : "video 🎬"}~\n│    Por favor espera 💗\n│\n╰────────────────────`,
      m
    )

    const apiUrl = `${API_BASE}?apikey=${API_KEY}&url=${encodeURIComponent(url)}&type=${type}&quality=720`

    const res = await fetchWithTimeout(apiUrl, 30000)
    if (!res.ok) throw new Error(`API respondió con status ${res.status}`)

    const json = await res.json()
    if (!json?.status || !json?.data?.download?.url) {
      throw new Error(json?.message || "La API no devolvió un enlace de descarga")
    }

    const downloadUrl = json.data.download.url

    const tmpDir = "./tmp"
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

    const base = Date.now()
    const filePath = path.join(tmpDir, type === "audio" ? `${base}.mp3` : `${base}.mp4`)
    tmpFiles.push(filePath)

    const buffer = await fetchWithTimeout(downloadUrl, 60000).then(r => r.arrayBuffer())
    fs.writeFileSync(filePath, Buffer.from(buffer))

    if (type === "audio") {
      await conn.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync(filePath),
          fileName: `${title}.mp3`,
          mimetype: "audio/mpeg",
          ptt: false
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(filePath),
          fileName: `${title}.mp4`,
          mimetype: "video/mp4"
        },
        { quoted: m }
      )
    }

    await conn.reply(
      m.chat,
      `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ✅ *¡Listo!* Tu archivo llegó ~\n│ 🌸 Disfrútalo mucho 💗\n│\n╰────────────────────`,
      m
    )

  } catch (e) {
    conn.reply(
      m.chat,
      `╭─「 🌸 *WAGURI BOT* 🌸 」\n│\n│ ❌ Ocurrió un error~\n│ ⚠️ *${e.message}*\n│\n╰────────────────────`,
      m
    )
  } finally {
    for (const f of tmpFiles) {
      if (fs.existsSync(f)) fs.unlinkSync(f)
    }
  }
}

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k`
  return views.toString()
}
