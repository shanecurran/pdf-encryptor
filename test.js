var fs = require('fs');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

const stream2buffer = (stream) => {

    return new Promise((resolve, reject) => {

        const _buf = [];

        stream.on("data", (chunk) => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", (err) => reject(err));

    });
}

const values = {
    'Vátryggingartaki': 'ev:Tk9D:KLJE+NAgbiOR7B13:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:y1jem6gxYd5T6AYttGi6MU/RLHU:$',
    Heimilisfang: 'ev:Tk9D:H22wWR+NZ+FtymnH:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:0HmEvsAYM+juMiI9c71NqJVCKw:$',
    Kennitala: 'ev:Tk9D:wOOqWmbRb40aDEMi:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:64QaaVItb8lP2hlbF/n1bw:$',
    'Staður': 'ev:Tk9D:K0gDSOoumRGO2dO1:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:3wikIP2aCsWGrFmy0gWBJQ:$',
    'Póstnúmer': 'ev:Tk9D:pn2rUVYzvqvsiPdF:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:X44HBeliHHLxlru/aCUnRA:$',
    Netfang: 'ev:Tk9D:rhRFPwkr8pwoHq17:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:ZdtQMLB4dhs6lmWTWRllaw:$',
    'Sími': 'ev:Tk9D:um3C9ag0IaZ+uJHw:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:2fw0c3IgNskn47OKoo3tzg:$',
    Nafn_hests: 'ev:Tk9D:oVNJB2EJn89askF6:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:cP77ZL4REk2b60idypfcXw:$',
    'IS_númer': 'ev:Tk9D:8qQ1s3LzqmgzR68d:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:iUeE5Nl/Pfh335OaH5plng:$',
    Nafn: 'ev:Tk9D:SPTNgNe6nQI7nH2b:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:xUEaCrV+D8DjaVvoMIXPnA:$',
    'Heiti_dýralæknastofu': 'ev:Tk9D:1GIG1JyT/KxV/+tR:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:hbF9HqPTmeLtzs4ORvyicg:$',
    date: 'ev:Tk9D:90Jeuj1QlIb66ZFt:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:TzYVziXdlZ0HW9NALtZj9A:$',
    month: 'ev:Tk9D:p9JjyONPdCG3mjcE:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:SVJhSnafiT8+3z0GTvcVNw:$',
    year: 'ev:Tk9D:3dkjZX87vNB1AIZY:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:0PavuRLYmePKFidlHkIxgg:$',
    'Lýsing': 'ev:Tk9D:gM2J8fFvf4uGZ+qV:AkzSPUhTEyK7Z89O/phlkRCDtWtdMwSQ6hOVL4B5aehi:KRu5jJGIFvze63j05ySzyw:$'
};

(async () => {
    const doc = new PDFDocument({ size: [1239, 1752], margin: 0, userPassword: "password" });

    var svg = fs.readFileSync('tmtemplate.svg').toString();

    for (const key in values) {
        svg = svg.replaceAll(`{${key}}`, values[key]);
    }

    doc.image('tm.png', 0, 0, {
        fit: [1239, 1752]
    });

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    doc.image(png, 0, 0, {
        fit: [1239, 1752]
    });

    doc.end();

    const outputPdf = await stream2buffer(doc);
    console.log(outputPdf);
})();
