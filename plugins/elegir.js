// Lista de trabajos disponibles — debe coincidir EXACTAMENTE con la de trabajar.js
const trabajos = [
  { nombre: "Programador", emoji: "💻" },
  { nombre: "Policía", emoji: "👮" },
  { nombre: "Doctor", emoji: "🩺" },
  { nombre: "Chef", emoji: "👨‍🍳" },
  { nombre: "Mecánico", emoji: "🔧" },
  { nombre: "Piloto", emoji: "✈️" },
  { nombre: "Youtuber", emoji: "🎥" },
  { nombre: "Abogado", emoji: "⚖️" },
  { nombre: "Bombero", emoji: "🚒" },
  { nombre: "Científico", emoji: "🧪" }
]

let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender]

  if (user.job) {
    return conn.reply(m.chat, `🌸 Ya tienes un trabajo: *${user.job}* ${trabajos.find(t => t.nombre === user.job)?.emoji || ''}\n\n✨ Usa *.w* para trabajar.`, m, global.rcanal)
  }

  let opcion = parseInt(args[0])

  if (!opcion || opcion < 1 || opcion > 10) {
    let lista = trabajos.map((t, i) => `*${i + 1}.* ${t.emoji} ${t.nombre}`).join('\n')
    return conn.reply(m.chat, `🌸 Primero debes elegir un trabajo 🌸\n\n${lista}\n\n✨ Usa *.elegir <número>* para elegir.\n📝 Ejemplo: *.elegir 1*`, m, global.rcanal)
  }

  let elegido = trabajos[opcion - 1]
  user.job = elegido.nombre

  conn.reply(m.chat, `🎉 ¡Ahora eres *${elegido.nombre}* ${elegido.emoji}!\n\n✨ Usa *.w* para empezar a trabajar y ganar ${global.moneda || 'WaguriCoins'}.`, m, global.rcanal)
}

handler.help = ['elegir']
handler.tags = ['economy']
handler.command = ['elegir', 'trabajo', 'elegirtrabajo']
handler.group = true
handler.register = true

export default handler
