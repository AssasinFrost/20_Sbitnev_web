require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const FAVORITES_PATH = './favorites.json';

app.get('/api/giveaways', async (req, res) => {
  const platform = req.query.platform || 'steam';
  const type = req.query.type || 'game';

  try {
    const response = await axios.get('https://www.gamerpower.com/api/giveaways', {
      params: { platform, type }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Ошибка при запросе к GamerPower:', err.message);
    res.status(500).json({ error: 'Ошибка при получении данных с GamerPower API' });
  }
});


function loadFavorites() {
  if (!fs.existsSync(FAVORITES_PATH)) fs.writeFileSync(FAVORITES_PATH, '[]');
  return JSON.parse(fs.readFileSync(FAVORITES_PATH, 'utf-8'));
}

function saveFavorites(data) {
  fs.writeFileSync(FAVORITES_PATH, JSON.stringify(data, null, 2));
}

app.get('/favorites', (req, res) => {
  const data = loadFavorites();
  res.json(data);
});

app.post('/favorites', (req, res) => {
  const favorites = loadFavorites();
  const { id, note } = req.body;

  if (favorites.find(f => f.id === id)) {
    return res.status(400).json({ error: 'Герой уже в избранном' });
  }

  favorites.push({ id, note });
  saveFavorites(favorites);
  res.status(201).json({ id, note });
});

app.patch('/favorites/:id', (req, res) => {
  const favorites = loadFavorites();
  const id = parseInt(req.params.id);
  const { note } = req.body;

  const hero = favorites.find(f => f.id === id);
  if (!hero) return res.status(404).json({ error: 'Герой не найден' });

  hero.note = note;
  saveFavorites(favorites);
  res.json(hero);
});

app.put('/favorites', (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Ожидается массив' });

  saveFavorites(data);
  res.json({ status: 'Список заменён', count: data.length });
});

// DELETE /favorites/:id
app.delete('/favorites/:id', (req, res) => {
  let favorites = loadFavorites();
  const id = parseInt(req.params.id);

  const before = favorites.length;
  favorites = favorites.filter(f => f.id !== id);
  if (favorites.length === before) return res.status(404).json({ error: 'Герой не найден' });

  saveFavorites(favorites);
  res.json({ deleted: id });
});


app.listen(port, () => {
  console.log(`Прокси-сервер запущен на http://localhost:${port}`);
});
