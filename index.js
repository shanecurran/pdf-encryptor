const axios = require("axios");
const FormData = require('form-data');

exports.handler = async (data, context) => {
    const { data: pdf } = await axios.get(data.pdf);
    const encryptedPdf = await context.encrypt(pdf);

    const form = new FormData();
    form.append('file', Buffer.from(encryptedPdf), 'file.pdf');

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
