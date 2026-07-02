// código creado por Rufino

let handler = async (m, { conn }) => {
  const memesList = [
    'https://cdn.hostrta.win/fl/ddmc.jpg',
    'https://cdn.hostrta.win/fl/lmzb.jpg',
    'https://cdn.hostrta.win/fl/esrf.jpg',
    'https://cdn.hostrta.win/fl/00p5.jpg',
    'https://cdn.hostrta.win/fl/bdog.jpg',
    'https://cdn.hostrta.win/fl/ik2o.jpg',
    'https://cdn.hostrta.win/fl/e7is.jpg',
    'https://cdn.hostrta.win/fl/9q4i.jpg',
    'https://cdn.hostrta.win/fl/o1dz.jpg',
    'https://cdn.hostrta.win/fl/hj4s.jpg',
    'https://cdn.hostrta.win/fl/cqck.jpg',
    'https://cdn.hostrta.win/fl/97u6.jpg'
  ]

  const randomIndex = Math.floor(Math.random() * memesList.length)
  const memeUrl = memesList[randomIndex]

  await conn.sendMessage(m.chat, {
    image: { url: memeUrl },
    caption: '😂 *¡Meme aleatorio!* 🌸'
  }, { quoted: m })
}

handler.help = ['meme']
handler.tags = ['fun']
handler.command = ['meme', 'memes']
handler.group = true
handler.register = true

export default handler