const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const BS_TOKEN = process.env.BRAWL_STARS_TOKEN;
const BS_BASE = 'https://api.brawlstars.com/v1';

app.use(cors());
app.use(express.json());

function cleanTag(tag) {
  return tag.replace(/^%23/i, '').replace(/^#/, '').toUpperCase().trim();
}

app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'Zurna Brawl Tracker' });
});

// Render'ın outbound IP'sini görmek için
app.get('/my-ip', async (req, res) => {
  try {
    const r = await axios.get('https://api.ipify.org?format=json', { timeout: 5000 });
    res.json({ ip: r.data.ip });
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.get('/api/player/:tag', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/players/%23${tag}`, {
      headers: { Authorization: `Bearer ${BS_TOKEN}` },
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || err.response?.data?.message || 'Oyuncu bulunamadi';
    console.error('Player error:', status, message, 'tag:', req.params.tag);
    res.status(status).json({ error: message });
  }
});

app.get('/api/player/:tag/battles', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/players/%23${tag}/battlelog`, {
      headers: { Authorization: `Bearer ${BS_TOKEN}` },
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || 'Savash gecmisi alinamadi';
    res.status(status).json({ error: message });
  }
});

app.get('/api/player/:tag/friends', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/players/%23${tag}/friends`, {
      headers: { Authorization: `Bearer ${BS_TOKEN}` },
      timeout: 8000
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.reason || 'Arkadaslar alinamadi';
    console.error('Friends error:', status, message, 'tag:', req.params.tag);
    res.status(status).json({ error: message });
  }
});

app.get('/api/club/:tag', async (req, res) => {
  try {
    const tag = cleanTag(req.params.tag);
    const response = await axios.get(`${BS_BASE}/clubs/%23${tag}`, {
      headers: { Authorization: `Bearer ${BS_TOKEN}` },
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
