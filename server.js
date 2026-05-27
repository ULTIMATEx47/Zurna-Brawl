const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// BrawlAPI - ücretsiz, token yok, IP kısıtlaması yok
const BS_BASE = 'https://api.brawlapi.com/v1';

app.use(cors());
app.use(express.json());

// Tag temizleme: #ABC123 veya ABC123 → %23ABC123
function cleanTag(tag) {
  const raw = tag.replace(/^%23/, '').replace(/^#/, '').toUpperCase();
  return encodeURIComponent('#' + raw);
}

// Sağlık kontrolü
app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'Zurna Brawl Tracker Backend', api: 'BrawlAPI' });
});

// Oyuncu bilgisi
app.get('/api/player/:tag', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/players/${tag}`, {
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || err.response?.data?.message || 'Oyuncu bulunamadi';
    res.status(status).json({ error: message });
  }
});

// Savaş geçmişi
app.get('/api/player/:tag/battles', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/players/${tag}/battlelog`, {
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || 'Savash gecmisi alinamadi';
    res.status(status).json({ error: message });
  }
});

// Kulüp bilgisi
app.get('/api/club/:tag', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/clubs/${tag}`, {
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || 'Kulup bulunamadi';
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Zurna Brawl Tracker backend calisiyor → port ${PORT}`);
});
