let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender]
  let harem = user.harem || []

  let index = parseInt(args[0])

  if (!index || index < 1 || index > harem.length) {
    return conn.reply(m.chat, `❀ Uso correcto: *.vender <número>*\n\n📍 Usa *.harem* para ver la lista numerada de tus waifus.`, m, global.rcanal)
  }

  let waifu = harem[index - 1]
  let reembolso = Math.floor(waifu.precio * 0.5)

  harem.splice(index - 1, 1)
  user.coin += reembolso

  conn.reply(m.chat, `💸 Vendiste a *${waifu.nombre}* ${waifu.emoji} por *${reembolso}* ${global.moneda || 'WaguriCoins'} (50% de su valor).`, m, global.rcanal)
}

handler.help = ['vender']
handler.tags = ['gacha']
handler.command = ['vender', 'venderwaifu']
handler.group = true
handler.register = true

export default handler
