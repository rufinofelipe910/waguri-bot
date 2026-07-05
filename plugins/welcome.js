let handler = m => m

handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return
  if (!m.messageStubParameters || !Array.isArray(m.messageStubParameters)) return

  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.welcome) return

  const fkontak = {
    "key": { "participants": "0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" },
    "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } },
    "participant": "0@s.whatsapp.net"
  }

  let groupMetadata = await conn.groupMetadata(m.chat).catch(_ => null)
  let groupName = groupMetadata?.subject || 'este grupo'
  let groupDesc = groupMetadata?.desc || ''

  // ===== ENTRA UN USUARIO =====
  if (m.messageStubType == 27) {
    for (let user of m.messageStubParameters) {

      let userName = `@${user.split('@')[0]}`
      let pp = await conn.profilePictureUrl(user, 'image').catch(_ => null) || 'https://files.catbox.moe/92bez6.jpeg'

      let text = chat.sWelcome
        ? chat.sWelcome
        : `✿°• 𝗡𝗨𝗘𝗩𝗢 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 •°✿\n\n💖 Bienvenido/a ${userName} a *${groupName}* 🌸${groupDesc ? `\n\n📋 Descripción:\n${groupDesc}` : ''}`

      text = text
        .replace(/@user/g, userName)
        .replace(/@group/g, groupName)
        .replace(/@desc/g, groupDesc)

      await conn.sendMessage(m.chat, { image: { url: pp }, caption: text, mentions: [user] }, { quoted: fkontak })
    }
  }

  // ===== SALE UN USUARIO =====
  if (m.messageStubType == 28) {
    for (let user of m.messageStubParameters) {

      let userName = `@${user.split('@')[0]}`
      let pp = await conn.profilePictureUrl(user, 'image').catch(_ => null) || 'https://files.catbox.moe/92bez6.jpeg'

      let text = chat.sBye
        ? chat.sBye
        : `🥀 ${userName} salió de *${groupName}*`

      text = text
        .replace(/@user/g, userName)
        .replace(/@group/g, groupName)

      await conn.sendMessage(m.chat, { image: { url: pp }, caption: text, mentions: [user] }, { quoted: fkontak })
    }
  }
}

export default handler
