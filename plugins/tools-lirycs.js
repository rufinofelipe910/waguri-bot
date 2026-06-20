// by Rufino 

import fetch from 'node-fetch';

const API_KEY = 'causa-4905b017c77b80a6';
const API_URL = 'https://rest.apicausas.xyz/api/v1/buscadores/lirycs';

async function handler(m, { text, conn, usedPrefix, command }) {
    if (!text) {
        return m.reply(`Por favor, ingresa el nombre de la canción.\n> *Ejemplo:* ${usedPrefix}letra bad bunny titi me pregunto`);
    }

    // Reacción de búsqueda
    try {
        await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });
    } catch (error) {
        console.error('Error enviando reacción:', error);
    }

    try {
        const url = `${API_URL}?apikey=${API_KEY}&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.status || !data.lyrics) {
            try {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            } catch (error) {}
            return m.reply("No encontré la letra de esa canción. Intenta con otro nombre o agrega el artista.");
        }

        const header = `🎵 *${data.title || text}*\n👤 *Artista:* ${data.artist || 'Desconocido'}\n\n`;
        const fullText = header + data.lyrics;

        // Enviar primero la miniatura si existe, sin texto largo en el caption
        if (data.thumbnail) {
            try {
                await conn.sendMessage(m.chat, {
                    image: { url: data.thumbnail },
                    caption: `🎵 *${data.title || text}*\n👤 *Artista:* ${data.artist || 'Desconocido'}`
                }, { quoted: m });
            } catch (error) {
                console.error('Error enviando miniatura:', error);
            }
        }

        // WhatsApp/Baileys puede recortar mensajes muy largos, así que se parte en bloques
        const MAX_LENGTH = 4000;
        if (fullText.length <= MAX_LENGTH) {
            await conn.sendMessage(m.chat, { text: fullText }, { quoted: m });
        } else {
            let remaining = data.lyrics;
            let first = true;
            while (remaining.length > 0) {
                const chunk = remaining.slice(0, MAX_LENGTH);
                remaining = remaining.slice(MAX_LENGTH);
                const chunkText = first ? header + chunk : chunk;
                await conn.sendMessage(m.chat, { text: chunkText }, { quoted: m });
                first = false;
            }
        }

        try {
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } catch (error) {
            console.error('Error enviando reacción de éxito:', error);
        }

    } catch (error) {
        console.error('Error en letra:', error);

        try {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        } catch (e) {}

        return m.reply("❌ Error al buscar la letra. Por favor, intenta nuevamente.");
    }
}

handler.help = ["letra <canción>"];
handler.tags = ["tools"];
handler.command = ["letra", "lyrics"];
handler.group = true;

export default handler;
                   
