const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const BS_BASE = 'https://api.brawlapi.com/v1';

app.use(cors());
app.use(express.json());

// Tag temizle: her formattan sade ABC123 yap, sonra URL'e göm
function cleanTag(raw) {
  // %23, # veya düz hepsini handle et
  return raw.replace(/^%23/i, '').replace(/^#/, '').toUpperCase().trim();
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'Zurna Brawl Tracker' });
});

app.get('/api/player/:tag', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    // axios'a doğrudan string ver, # ile
    const response = await axios.get(`${BS_BASE}/players/%23${tag}`, {
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || err.response?.data?.message || 'Oyuncu bulunamadi';
    console.error('Player error:', err.response?.data, 'tag:', req.params.tag);
    res.status(status).json({ error: message });
  }
});

app.get('/api/player/:tag/battles', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/players/%23${tag}/battlelog`, {
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || 'Savash gecmisi alinamadi';
    res.status(status).json({ error: message });
  }
});

app.get('/api/club/:tag', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/clubs/%23${tag}`, {
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
  console.log(`Zurna Brawl Tracker calisiyor → port ${PORT}`);
});
