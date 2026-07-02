// Menú estilo Waguri adaptado para Telegram (Telegraf)
// Creado por Rufino - Adaptado para Senna Bot

import fetch from 'node-fetch'

const channelId   = '120363423258391692@newsletter'
const channelName = '🌸❖𝗦𝗘𝗡𝗡𝗔 𝗕𝗢𝗧❖🌸'
const menuImage   = global.fg_logo || 'https://cdn.dev-ander.xyz/a/SV0S.jpg'

export default {
  help: ["menu"],
  tags: ["main"],
  command: ["menu", "help", "menú", "waguri", "menucompleto", "comandos", "allmenu"],

  run: async (ctx, { conn, usedPrefix }) => {
    let userId    = ctx.from.id
    let username  = ctx.from.username || ctx.from.first_name || 'Usuario'
    let totalreg  = Object.keys(global.db?.data?.users || {}).length
    let totalCmds = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    const uptime  = clockString(process.uptime() * 1000)

    // Construir lista de comandos por categoría
    let plugins = Object.values(global.plugins)
    let categorias = {}

    for (let plugin of plugins) {
      if (!plugin.help || !plugin.tags) continue
      for (let tag of plugin.tags) {
        if (!categorias[tag]) categorias[tag] = []
        for (let help of plugin.help) {
          categorias[tag].push(help)
        }
      }
    }

    // Emojis por categoría
    const catEmojis = {
      main: '💖',
      ai: '🤖',
      anime: '🌸',
      search: '🔍',
      dl: '📥',
      group: '👥',
      owner: '👑',
      tools: '🛠️'
    }

    const catNames = {
      main: 'HERRAMIENTAS',
      ai: 'INTELIGENCIA ARTIFICIAL',
      anime: 'ANIME',
      search: 'STALK',
      dl: 'DESCARGAS',
      group: 'GRUPO',
      owner: 'OWNER',
      tools: 'UTILIDADES'
    }

    let txt = `
✿°•  𝗦𝗘𝗡𝗡𝗔 𝗕𝗢𝗧  •°✿
⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑
🌸 ¡Hola @${username}! ⸜(｡˃ᵕ˂)⸝♡
⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑
🌀 *Tipo* » ⭐ Principal
⏱️ *Uptime* » ${uptime}
👥 *Users* » ${totalreg}
🧩 *Cmds* » ${totalCmds}

`.trim()

    // Agregar comandos por categoría
    for (let tag in catNames) {
      if (!categorias[tag] || categorias[tag].length === 0) continue

      txt += `\n${catEmojis[tag] || '✨'} *${catNames[tag]}*\n`

      for (let cmd of categorias[tag]) {
        txt += `🌈 ${usedPrefix}${cmd}\n`
      }
    }

    txt += `\n⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑\n🌸 _${channelName}_`

    // Enviar como foto con caption (Telegraf)
    try {
      await ctx.replyWithPhoto(
        { url: menuImage },
        {
          caption: txt,
          parse_mode: 'Markdown'
        }
      )
    } catch (e) {
      // Si falla la imagen, enviar solo texto
      await ctx.reply(txt, { parse_mode: 'Markdown' })
    }
  }
}

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours   = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}
