const axios = require("axios");
const FormData = require('form-data');
const svg = require('fs').readFileSync('tmtemplate.svg').toString();
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

exports.handler = async (data, context) => {
    const doc = new PDFDocument({ size: [1239, 1752], margin: 0, userPassword: data.password || "password" });

    let customisedSvg = "";
    for (const key in data) {
        customisedSvg = svg.replaceAll(`{${key}}`, data[key]);
    }

    doc.image('tm.png', 0, 0, {
        fit: [1239, 1752]
    });

    const png = await sharp(Buffer.from(customisedSvg)).png().toBuffer();
    doc.image(png, 0, 0, {
        fit: [1239, 1752]
    });
    doc.end();

    const outputPdf = await stream2buffer(doc);

    const form = new FormData();
    form.append('file', outputPdf, 'file.pdf');

    const { data: uploaded } = await axios.put('https://transfer.sh/file.pdf', form, {
        headers: {
            ...form.getHeaders()
        }
    });

    return {
        encryptedPdf: uploaded,
        name: data.name
    };
};
