const midtransClient = require('midtrans-client');

const midTrans = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MT_SERVER_KEY,
    clientKey: process.env.MT_CLIENT_KEY,
});

export default midTrans;
