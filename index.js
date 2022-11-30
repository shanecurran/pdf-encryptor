const axios = require("axios");
const FormData = require('form-data');
const svg = require('fs').readFileSync('tmtemplate.svg').toString();
const PDFDocument = require('pdfkit');
const svg2img = require('svg2img');

const stream2buffer = (stream) => {
    return new Promise((resolve, reject) => {
        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));
    });
};

exports.handler = async (data, context) => {
    const doc = new PDFDocument({ size: [1239, 1752], margin: 0, userPassword: data.password || "password" });

    let customisedSvg = "";
    console.log(data);
    for (const key in JSON.parse(JSON.stringify(data))) {
        customisedSvg = svg.replaceAll(`{${key}}`, data[key]);
    }
    customisedSvg = customisedSvg.replace(/\{.*?[^\}]\}/g, '');

    doc.image('tm.png', 0, 0, {
        fit: [1239, 1752]
    });

    const png = await new Promise((resolve, reject) => {
        svg2img(customisedSvg, (err, buffer) => {
            if (err) reject(err);
            resolve(buffer);
        })
    });

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
        password: context.encrypt(data.password || "password")
    };
};
