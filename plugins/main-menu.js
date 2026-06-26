// código creado por Rufino 

import fetch from 'node-fetch'

const channelId   = '120363423258391692@newsletter'
const channelName = '🌸❖𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧❖🌸'
const menuImage   = 'https://qu.ax/9ZCJX'

let handler = async (m, { conn }) => {
  let mentionedJid = m.mentionedJid
  let userId       = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender
  let totalreg     = Object.keys(global.db.data.users).length
  let totalCmds    = Object.values(global.plugins).filter((v) => v.help && v.tags).length
  const uptime     = clockString(process.uptime() * 1000)
  const tipo       = conn.user.jid == global.conn.user.jid ? '⭐ Principal' : '🔹 Sub-bot'

  let txt = `
✿°•  𝗪𝗔𝗚𝗨𝗥𝗜 𝗕𝗢𝗧  •°✿
⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑
🌸 ¡Hola @${userId.split('@')[0]}! ⸜(｡˃ᵕ˂)⸝♡
⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑
🌀 *Tipo* » ${tipo}
⏱️ *Uptime* » ${uptime}
👥 *Users* » ${totalreg}
🧩 *Cmds* » ${totalCmds}

💖 *HERRAMIENTAS*
🌈 ping
🌈 autoadmin
🌈 demote
🌈 leave
🌈 tag
🌈 invocar
🌈 logotipo
🌈 setbanner
🌈 setcurrency
🌈 setname
🌈 setprimary
🌈 bots
🌈 reload
🌈 setprefijo
🌈 quitarpref
🌈 update
🌈 kick
🌈 antilink
🌈 del
🌈 join
🌈 reg
🌈 creador
🌈 repo
🌈 link
🌈 sticker
🌈 emojimix
🌈 letra

💖 *DIVERSIÓN*
🌈 doxear
🌈 facto
🌈 piropo
🌈 reto
🌈 top
🌈 iqtest
🌈 gey

💖 *ANIME*
🌈 bath
🌈 bite
🌈 blush
🌈 bored
🌈 buenas-noches
🌈 buenos-dias
🌈 cry
🌈 dance
🌈 fumar
🌈 hug
🌈 kiss
🌈 pensar
🌈 sacred
🌈 slap
🌈 sleep

💖 *INTELIGENCIA ARTIFICIAL*
🌈 claude
🌈 gemini
🌈 GPT
🌈 copilot
🌈 flux

💖 *STALK*
🌈 github
🌈 instagram
🌈 tiktok

💖 *DESCARGAS*
🌈 play
🌈 play2
🌈 tiktoksearch
🌈 ig
🌈 APK
🌈 pin
🌈 fb
🌈 mediafire

💖 *RPG*
🌈 cazar
🌈 contratos
🌈 aceptar
🌈 completar
🌈 perfil
🌈 diario
🌈 minar
🌈 transferir
🌈 taller
🌈 comprar
🌈 comprar.boy
🌈 item
🌈 vender
🌈 duelo
🌈 hack
🌈 best
🌈 estadisticas
🌈 inventario

💖 *ECONOMÍA*
🌈 trabajar
🌈 balance
🌈 pay
🌈 rob
🌈 deposit
🌈 withdraw
⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑⌑
🌸 _${channelName}_`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: menuImage },
    caption: txt,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelId,
        newsletterName: channelName,
        serverMessageId: -1
      }
    },
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'waguri', 'help', 'menucompleto', 'comandos', 'helpcompleto', 'allmenu']

export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours   = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}
