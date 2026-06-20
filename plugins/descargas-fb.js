// by Rufino 

import fetch from 'node-fetch';

const API_KEY = 'causa-4905b017c77b80a6';
const API_URL = 'https://rest.apicausas.xyz/api/v1/descargas/facebook';

function extractMediaUrl(data) {
    return (
        data?.url ||
        data?.result?.url ||
        data?.data?.url ||
        data?.video ||
        data?.result?.video ||
        data?.data?.video ||
        data?.hd ||
        data?.sd ||
        data?.medias?.[0]?.url ||
        data?.result?.medias?.[0]?.url ||
        null
    );
}

async function handler(m, { text, conn, usedPrefix, command }) {
    if (!text || !text.startsWith('http')) {
        return m.reply(`Por favor, ingresa un link válido de Facebook.\n> *Ejemplo:* ${usedPrefix}fb https://www.facebook.com/watch?v=123456789`);
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
        console.log('Respuesta Facebook API:', JSON.stringify(data));

        const mediaUrl = extractMediaUrl(data);

        if (!data.status || !mediaUrl) {
            try {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            } catch (e) {}
            return m.reply("No pude descargar ese video de Facebook. Revisa que el link sea público y válido.");
        }

        await conn.sendMessage(m.chat, {
            video: { url: mediaUrl },
            caption: data.title || '🎬 Video de Facebook'
        }, { quoted: m });

        try {
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } catch (e) {}

    } catch (error) {
        console.error('Error en Facebook:', error);
        try {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        } catch (e) {}
        return m.reply("❌ Error al descargar el video de Facebook. Por favor, intenta nuevamente.");
    }
}

handler.help = ["fb <link>"];
handler.tags = ["downloader"];
handler.command = ["fb", "facebook", "fbdl"];
handler.group = true;

export default handler;
                       
