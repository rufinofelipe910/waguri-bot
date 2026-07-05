// by Rufino 

import fetch from 'node-fetch';

const API_KEY = 'reyrufino-20072010';
const API_URL = 'https://rest.apicausas.xyz/api/v1/descargas/mediafire';

function extractFileInfo(data) {
    const url =
        data?.url ||
        data?.result?.url ||
        data?.data?.url ||
        data?.link ||
        data?.result?.link ||
        data?.data?.link ||
        null;

    const filename =
        data?.filename ||
        data?.result?.filename ||
        data?.data?.filename ||
        data?.title ||
        'archivo';

    return { url, filename };
}

async function handler(m, { text, conn, usedPrefix, command }) {
    if (!text || !text.startsWith('http')) {
        return m.reply(`Por favor, ingresa un link válido de MediaFire.\n> *Ejemplo:* ${usedPrefix}mediafire https://www.mediafire.com/file/xxxx/archivo.zip/file`);
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
        console.log('Respuesta MediaFire API:', JSON.stringify(data));

        const { url: fileUrl, filename } = extractFileInfo(data);

        if (!data.status || !fileUrl) {
            try {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            } catch (e) {}
            return m.reply("No pude descargar ese archivo de MediaFire. Revisa que el link sea válido.");
        }

        await conn.sendMessage(m.chat, {
            document: { url: fileUrl },
            fileName: filename,
            mimetype: 'application/octet-stream'
        }, { quoted: m });

        try {
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } catch (e) {}

    } catch (error) {
        console.error('Error en MediaFire:', error);
        try {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        } catch (e) {}
        return m.reply("❌ Error al descargar el archivo de MediaFire. Por favor, intenta nuevamente.");
    }
}

handler.help = ["mediafire <link>"];
handler.tags = ["downloader"];
handler.command = ["mediafire", "mf"];
handler.group = true;

export default handler;
