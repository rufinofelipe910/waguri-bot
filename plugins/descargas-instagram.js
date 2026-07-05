// by Rufino 

import fetch from 'node-fetch';

const API_KEY = 'reyrufino-20072010';
const API_URL = 'https://rest.apicausas.xyz/api/v1/descargas/instagram';

function extractMediaList(data) {
    // Intenta cubrir varias formas comunes de respuesta: array de medias, o un solo url
    const candidates =
        data?.medias ||
        data?.result?.medias ||
        data?.data?.medias ||
        data?.result ||
        data?.data ||
        null;

    if (Array.isArray(candidates)) {
        return candidates
            .map((item) => (typeof item === 'string' ? item : item?.url))
            .filter(Boolean);
    }

    const single =
        data?.url ||
        data?.video ||
        data?.result?.url ||
        data?.data?.url ||
        null;

    return single ? [single] : [];
}

async function handler(m, { text, conn, usedPrefix, command }) {
    if (!text || !text.startsWith('http')) {
        return m.reply(`Por favor, ingresa un link válido de Instagram.\n> *Ejemplo:* ${usedPrefix}ig https://www.instagram.com/reel/xxxxx/`);
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "⌚", key: m.key } });
    } catch (error) {
        console.error('Error enviando reacción:', error);
    }

    try {
        const url = `${API_URL}?apikey=${API_KEY}&url=${encodeURIComponent(text)}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Respuesta Instagram API:', JSON.stringify(data));

        const mediaList = extractMediaList(data);

        if (!data.status || mediaList.length === 0) {
            try {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            } catch (e) {}
            return m.reply("No pude descargar ese contenido de Instagram. Revisa que el link sea público y válido.");
        }

        for (const mediaUrl of mediaList) {
            const isVideo = /\.mp4(\?|$)/i.test(mediaUrl) || data.type === 'video';
            if (isVideo) {
                await conn.sendMessage(m.chat, { video: { url: mediaUrl } }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { image: { url: mediaUrl } }, { quoted: m });
            }
        }

        try {
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } catch (e) {}

    } catch (error) {
        console.error('Error en Instagram:', error);
        try {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        } catch (e) {}
        return m.reply("❌ Error al descargar el contenido de Instagram. Por favor, intenta nuevamente.");
    }
}

handler.help = ["ig <link>"];
handler.tags = ["downloader"];
handler.command = ["ig", "igdl"];
handler.group = true;

export default handler;
