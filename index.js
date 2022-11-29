const axios = require("axios");

exports.handler = async (data, context) => {
    const { data: pdf } = await axios.get(data.pdf);
    const encryptedPdf = await context.encrypt(pdf);

    return {
        encryptedPdf,
        name: data.name
    };
};
