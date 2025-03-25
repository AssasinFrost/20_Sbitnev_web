require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GamerPower proxy
app.get('/api/giveaways', async (req, res) => {
  const platform = req.query.platform || 'steam';
  const type = req.query.type || 'game';

  try {
    const response = await axios.get('https://www.gamerpower.com/api/giveaways', {
      params: {
        platform,
        type
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Ошибка при запросе к GamerPower:', err.message);
    res.status(500).json({ error: 'Ошибка при получении данных с GamerPower API' });
  }
});


app.listen(port, () => {
  console.log(`Прокси-сервер запущен на http://localhost:${port}`);
});