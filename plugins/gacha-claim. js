let handler = async (m, { conn, args }) => {
  const offerId = parseInt(args[0])

  if (!offerId) {
    return conn.reply(m.chat, `❀ Uso correcto: *.claim <id>*\n\n📍 El ID aparece cuando usas *.rw*`, m, global.rcanal)
  }

  let offer = global.waifuOffers?.[offerId]

  if (!offer) {
    return conn.reply(m.chat, `⚠️ Esa oferta ya no existe, expiró o ya fue reclamada. Usa *.rw* para invocar una nueva.`, m, global.rcanal)
  }

  if (Date.now() > offer.expira) {
    delete global.waifuOffers[offerId]
    return conn.reply(m.chat, `⌛ Esta waifu ya se fue, fuiste muy lento/a. Usa *.rw* de nuevo.`, m, global.rcanal)
  }

  let user = global.db.data.users[m.sender]
  if (!user.harem) user.harem = []

  if (user.coin < offer.precio) {
    return conn.reply(m.chat, `💸 No tienes suficientes ${global.moneda || 'WaguriCoins'}.\n\n💰 Necesitas: *${offer.precio}*\n🪙 Tienes: *${user.coin}*`, m, global.rcanal)
  }

  user.coin -= offer.precio
  user.harem.push({
    id: offerId,
    nombre: offer.nombre,
    rareza: offer.rareza,
    emoji: offer.emoji,
    precio: offer.precio,
    imagen: offer.imagen,
    danbooru_id: offer.danbooru_id
  })
  delete global.waifuOffers[offerId]

  conn.reply(m.chat, `🎉 ¡Reclamaste a *${offer.nombre}* ${offer.emoji}!\n\n💖 Ahora es parte de tu harem. Usa *.harem* para verla.`, m, global.rcanal)
}

handler.help = ['claim']
handler.tags = ['gacha']
handler.command = ['claim']
handler.group = true
handler.register = true

export default handler
