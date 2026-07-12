// ====================================================================
// --- LIBRERÍAS REQUERIDAS ---
// ====================================================================
import axios from 'axios';
import * as cheerio from 'cheerio';

// --- CONSTANTES Y UTILIDADES LOCALES ---

// 1. Headers de Solicitud
const DEFAULT_HEADERS = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'es-ES,es;q=0.9',
    'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
};

// 2. Función parseFileSize
/**
 * @returns as a kilobit (kb)
 */
function parseFileSize (size) {
    return parseFloat(size) * (
      /GB/i.test(size)
       ? 1000000
        : /MB/i.test(size)
         ? 1000
          : /KB/i.test(size)
           ? 1
            : /bytes?/i.test(size)
             ? 0.001
              : /B/i.test(size)
               ? 0.1
                : 0
    )
}

// --- FUNCIÓN SCRAPER DE MEDIAFIRE ADAPTADA PARA AXIOS ---
async function mediafiredlScraper(url) {
    const response = await axios.get(url, {
        headers: DEFAULT_HEADERS
    });

    const data = response.data;
    const $ = cheerio.load(data);

    const Url = ($('#downloadButton').attr('href') || '').trim();
    const url2 = ($('#download_link > a.retry').attr('href') || '').trim();

    const $intro = $('div.dl-info > div.intro');
    const filename = $intro.find('div.filename').text().trim();
    const filetype = $intro.find('div.filetype > span').eq(0).text().trim();

    const extMatch = /\(\.(.*?)\)/.exec($intro.find('div.filetype > span').eq(1).text());
    const ext = extMatch?.[1]?.trim() || 'bin';

    const $li = $('div.dl-info > ul.details > li');
    const aploud = $li.eq(1).find('span').text().trim();
    const filesizeH = $li.eq(0).find('span').text().trim();
    const filesize = parseFileSize(filesizeH);

    const result = {
        url: Url || url2,
        filename,
        filetype,
        ext,
        aploud,
        filesizeH,
        filesize
    }

    if (!result.url) {
        throw new Error("No se pudo extraer el enlace de descarga directa. El archivo podría ser privado o el selector de MediaFire ha cambiado.");
    }

    return result;
}

// ====================================================================
// --- HANDLER PRINCIPAL (MEDIAFIRE WAGURI) ---
// ====================================================================

const newsletterJid = '120363418071540900@newsletter';
const newsletterName = '𐚁 ֹ ִ 𝚆𝙰𝙶𝚄𝚁𝙸 𝙱𝙾𝚃 | 𝙶𝙰𝙲𝙷𝙰 ୧ ֹ ִ✿';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const name = conn.getName(m.sender);

    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid,
            newsletterName,
            serverMessageId: -1
        },
        externalAdReply: {
            title: '🌸 Waguri encontró tu archivo! 🍓',
            body: `Procesando descarguita para ${name}...`,
            thumbnail: icons, // asegúrate que 'icons' esté definido globalmente
            sourceUrl: redes, // asegúrate que 'redes' esté definido globalmente
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    if (!text) {
        return conn.reply(m.chat, `🌸 ⋆｡˚ ☁︎ ˚｡⋆ 🌸\n\n` +
        `꒰ঌ 🥺 ꒱\n` +
        `*— ¡Waguri-chan necesita un link!* Pásame la URL de MediaFire para descargarte tu archivito (｡>﹏<｡)\n\n` +
        `🌸 ⋆｡˚ ☁︎ ˚｡⋆ 🌸`, m, { contextInfo, quoted: m });
    }

    conn.sendMessage(m.chat, { react: { text: "🔄", key: m.key } });
    conn.reply(m.chat, `🔄 *— ¡Waguri está trabajando!* Espérame un ratito ${name}... estoy bajando tu archivo (´｡• ᵕ •｡\`)`, m, { contextInfo, quoted: m });

    try {
        let fileData = await mediafiredlScraper(text);

        const caption = `
🌸 ⋆｡˚ ☁︎ ˚｡⋆ 🌸
[ 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰! ]

📦 *Nombre:* ${fileData.filename}
⚖️ *Peso:* ${fileData.filesizeH}
📂 *Tipo:* ${fileData.filetype} (.${fileData.ext})
⬆️ *Subido:* ${fileData.aploud}
🔗 *Link:* ${text}

*— ¡Listo! Aquí tienes tu archivo* ♡(>ᴗ•)
🌸 ⋆｡˚ ☁︎ ˚｡⋆ 🌸`;

        await conn.sendFile(m.chat, fileData.url, fileData.filename, caption, m, null, { contextInfo });
        await m.react('✅');

    } catch (error) {
        console.error("Error al procesar MediaFire:", error);
        await m.react('❌');

        const errorMessage = (error.message && typeof error.message === 'string')
                           ? error.message.substring(0, 100)
                            : 'Error desconocido durante el scraping.';

        conn.reply(m.chat, `🌸 ⋆｡˚ ☁︎ ˚｡⋆ 🌸\n\n` +
        `꒰ঌ 😿 ꒱\n` +
        `*— ¡Ay no! Algo salió mal* ${name}\n` +
        `No pude descargar el archivo. ¿Estás segura que el link es público?\n` +
        `*Error:* ${errorMessage}\n\n` +
        `🌸 ⋆｡˚ ☁︎ ˚｡⋆ 🌸`, m, { contextInfo, quoted: m });
    }
}

handler.help = ['mediafire <url>'];
handler.tags = ['descargas'];
handler.command = ['mf', 'mediafire'];
handler.coin = 10;
handler.register = true;
handler.group = true;

export default handler;