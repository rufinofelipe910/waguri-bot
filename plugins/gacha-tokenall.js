var handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()
  
  const PROTECTION_COST = 5000 // Costo por waifu
  const PROTECTION_DURATION = 7 * 24 * 60 * 60 * 1000 // 1 semana

  try {
    let user = global.db.data.users[userId]
    if (!user.harem) user.harem = []

    // Contar waifus sin protección
    const waifusToProtect = user.harem.filter(w => !w.protectedUntil || w.protectedUntil < now)
    const count = waifusToProtect.length

    if (count === 0) {
      return conn.reply(m.chat, `🛡️ Todas tus waifus ya están protegidas. No hay nada que hacer.`, m, global.rcanal)
    }

    const totalCost = PROTECTION_COST * count
    const userCoins = user.coin || 0

    if (userCoins < totalCost) {
      return conn.reply(m.chat, `💸 No tienes suficientes monedas.\n\n💰 Necesitas: *${totalCost}*\n🪙 Tienes: *${userCoins}*\n\n*Costo por waifu: 5000 WaguriCoins*`, m, global.rcanal)
    }

    // Proteger waifus
    for (let waifu of waifusToProtect) {
      waifu.protectedUntil = now + PROTECTION_DURATION
    }

    // Cobrar
    user.coin -= totalCost

    conn.reply(m.chat, `🛡️ *PROTECCIÓN ACTIVADA*\n\n✅ Protegiste *${count}* waifu(s).\n💰 Costo total: *${totalCost}* WaguriCoins\n📅 Duración: *7 días*\n\n✨ Tus waifus están seguras ahora.`, m, global.rcanal)
    await m.react('✅')

  } catch (e) {
    console.log('Error en proteger:', e)
    conn.reply(m.chat, `✘ Error: ${e.message}`, m, global.rcanal)
  }
}

handler.help = ['proteger']
handler.tags = ['gacha']
handler.command = ['proteger', 'shield', 'escudo']
handler.group = true
handler.register = true

export default handler
