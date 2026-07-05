// By Duarte (actualizado por Rufino)
let cooldowns = {}

// Lista de trabajos — debe coincidir EXACTAMENTE con la de elegir.js
const trabajos = [
  {
    nombre: "Programador",
    emoji: "💻",
    tareas: [
      "💻 Hackeaste la red de una empresa y ganaste",
      "🖥️ Arreglaste un bug crítico en producción y ganaste",
      "⌨️ Programaste una app para un cliente y obtuviste",
      "🐛 Pasaste la noche depurando código y ganaste",
      "🌐 Creaste un sitio web y recibiste",
      "🗄️ Optimizaste una base de datos y ganaste",
      "🤖 Desarrollaste una IA para un cliente y obtuviste",
      "☁️ Configuraste un servidor en la nube y recibiste",
      "🏆 Ganaste un hackathon y obtuviste",
      "⚙️ Automatizaste un proceso con un script y ganaste"
    ]
  },
  {
    nombre: "Policía",
    emoji: "👮",
    tareas: [
      "🚔 Atrapaste a un ladrón y ganaste",
      "🚨 Resolviste un caso importante y obtuviste",
      "🛑 Multaste a varios infractores y recibiste",
      "🕵️ Investigaste una pista clave y ganaste",
      "👮 Patrullaste la ciudad toda la noche y obtuviste",
      "🚓 Desarticulaste una banda criminal y ganaste",
      "🛡️ Escoltaste a un VIP y obtuviste",
      "🚗 Recuperaste un vehículo robado y recibiste",
      "🔍 Capturaste a un fugitivo y ganaste",
      "📢 Controlaste un disturbio y obtuviste"
    ]
  },
  {
    nombre: "Doctor",
    emoji: "🩺",
    tareas: [
      "🩺 Salvaste una vida en cirugía y ganaste",
      "💉 Vacunaste a todo un barrio y obtuviste",
      "🏥 Atendiste emergencias toda la noche y recibiste",
      "🦴 Curaste una fractura complicada y ganaste",
      "🧬 Diagnosticaste un caso difícil y obtuviste",
      "❤️ Realizaste un trasplante exitoso y ganaste",
      "👶 Atendiste un parto complicado y obtuviste",
      "🔬 Descubriste una enfermedad rara a tiempo y recibiste",
      "🏠 Diste consulta a domicilio y ganaste",
      "💓 Trataste una emergencia cardíaca y obtuviste"
    ]
  },
  {
    nombre: "Chef",
    emoji: "👨‍🍳",
    tareas: [
      "👨‍🍳 Cocinaste en un restaurante 5 estrellas y ganaste",
      "🍰 Horneaste postres deliciosos y obtuviste",
      "🍜 Preparaste un banquete completo y recibiste",
      "🔪 Ganaste un concurso de cocina y obtuviste",
      "🍽️ Atendiste una gran cena de gala y ganaste",
      "📋 Creaste un plato nuevo en el menú y obtuviste",
      "💍 Cateraste una boda y recibiste",
      "⭐ Ganaste una estrella Michelin y ganaste",
      "🏢 Preparaste comida para un evento corporativo y obtuviste",
      "📚 Enseñaste una clase de cocina y recibiste"
    ]
  },
  {
    nombre: "Mecánico",
    emoji: "🔧",
    tareas: [
      "🔧 Reparaste un motor y ganaste",
      "🛠️ Arreglaste un auto de carreras y obtuviste",
      "🚗 Cambiaste piezas de un vehículo y recibiste",
      "⚙️ Solucionaste una falla eléctrica y ganaste",
      "🏁 Preparaste un auto para una carrera y obtuviste",
      "🚙 Restauraste un auto clásico y ganaste",
      "🛢️ Hiciste un cambio de aceite express y obtuviste",
      "⚡ Reparaste una transmisión dañada y recibiste",
      "🏍️ Ajustaste el motor de una moto y ganaste",
      "🛣️ Solucionaste una avería en carretera y obtuviste"
    ]
  },
  {
    nombre: "Piloto",
    emoji: "✈️",
    tareas: [
      "✈️ Volaste un avión comercial y ganaste",
      "🛫 Completaste un vuelo internacional y obtuviste",
      "🗺️ Aterrizaste con éxito en condiciones difíciles y recibiste",
      "🎫 Transportaste pasajeros VIP y ganaste",
      "🌍 Sobrevolaste el océano y obtuviste",
      "🚁 Pilotaste un vuelo de emergencia y ganaste",
      "👨‍✈️ Entrenaste a un copiloto nuevo y obtuviste",
      "🛩️ Volaste un jet privado y recibiste",
      "📦 Completaste una ruta de carga y ganaste",
      "⛈️ Evitaste una tormenta en pleno vuelo y obtuviste"
    ]
  },
  {
    nombre: "Youtuber",
    emoji: "🎥",
    tareas: [
      "🎥 Subiste un video viral y ganaste",
      "📈 Conseguiste miles de suscriptores nuevos y obtuviste",
      "🎬 Grabaste un video patrocinado y recibiste",
      "🔴 Hiciste un directo exitoso y ganaste",
      "💬 Tu video llegó a tendencias y obtuviste",
      "🤝 Colaboraste con otro creador y ganaste",
      "🥈 Ganaste un botón de plata y obtuviste",
      "✂️ Editaste un video toda la noche y recibiste",
      "💡 Se te ocurrió una idea viral y ganaste",
      "👕 Lanzaste tu propio merch y obtuviste"
    ]
  },
  {
    nombre: "Abogado",
    emoji: "⚖️",
    tareas: [
      "⚖️ Ganaste un juicio importante y obtuviste",
      "📜 Redactaste un contrato millonario y ganaste",
      "🏛️ Defendiste un caso difícil en la corte y recibiste",
      "🗂️ Asesoraste a un cliente importante y obtuviste",
      "👨‍⚖️ Convenciste al juez con tu alegato y ganaste",
      "🤝 Negociaste un acuerdo extrajudicial y obtuviste",
      "📈 Ganaste una apelación complicada y recibiste",
      "🏢 Representaste a una empresa en un litigio y ganaste",
      "🌎 Revisaste un contrato internacional y obtuviste",
      "❤️ Defendiste un caso pro bono y ganaste"
    ]
  },
  {
    nombre: "Bombero",
    emoji: "🚒",
    tareas: [
      "🚒 Apagaste un incendio a tiempo y ganaste",
      "🔥 Rescataste a una familia atrapada y obtuviste",
      "🐱 Rescataste a un gato de un árbol y recibiste",
      "🧯 Controlaste una emergencia peligrosa y ganaste",
      "🚨 Respondiste a una llamada de emergencia y obtuviste",
      "🏢 Evacuaste un edificio en llamas y ganaste",
      "🚑 Rescataste a alguien de un accidente de auto y obtuviste",
      "🌲 Contuviste un incendio forestal y recibiste",
      "🎓 Capacitaste a nuevos bomberos y ganaste",
      "🌊 Salvaste a una mascota de una inundación y obtuviste"
    ]
  },
  {
    nombre: "Científico",
    emoji: "🧪",
    tareas: [
      "🧪 Descubriste una nueva fórmula y ganaste",
      "🔬 Publicaste una investigación importante y obtuviste",
      "🧫 Hiciste un experimento exitoso y recibiste",
      "🚀 Contribuiste a un proyecto espacial y ganaste",
      "🌡️ Resolviste un problema científico complejo y obtuviste",
      "💊 Desarrollaste una vacuna experimental y ganaste",
      "🦋 Descubriste una nueva especie y obtuviste",
      "🎤 Presentaste tu investigación en una conferencia y recibiste",
      "📄 Patentaste un invento y ganaste",
      "🔎 Analizaste muestras en el laboratorio y obtuviste"
    ]
  }
]

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]

  // Si no ha elegido trabajo todavía
  if (!user.job) {
    let lista = trabajos.map((t, i) => `*${i + 1}.* ${t.emoji} ${t.nombre}`).join('\n')
    return conn.reply(m.chat, `🌸 Antes de trabajar debes elegir un empleo 🌸\n\n${lista}\n\n✨ Usa *.elegir <número>* para elegir.\n📝 Ejemplo: *.elegir 1*`, m, global.rcanal)
  }

  let tiempo = 5 * 60
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `🌸 Necesitas descansar... 🌸\n\n✨ Debes esperar *${tiempo2}* para trabajar de nuevo ✨`, m, global.rcanal)
  }

  let trabajoActual = trabajos.find(t => t.nombre === user.job)

  // Por si el trabajo guardado ya no existe en la lista (ej. cambiaste los nombres)
  if (!trabajoActual) {
    user.job = null
    return conn.reply(m.chat, `⚠️ Tu trabajo ya no existe. Usa *.elegir* para elegir uno nuevo.`, m, global.rcanal)
  }

  let rsl = Math.floor(Math.random() * 500)
  cooldowns[m.sender] = Date.now()

  await conn.reply(m.chat, `${pickRandom(trabajoActual.tareas)} *${toNum(rsl)}* ( *${rsl}* ) ${global.moneda || 'WaguriCoins'}`, m, global.rcanal)
  user.coin += rsl
}

handler.help = ['trabajar']
handler.tags = ['economy']
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar']
handler.group = true
handler.register = true

export default handler

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number <= -1000 && number > -1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number <= -1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return number.toString()
  }
}

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
