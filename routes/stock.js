const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = 'ysb6ycYaDtM5fx8J8Ypr9ZWLOlhkWO7K';

router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const response = await axios.get(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${API_KEY}`);
    const data = response.data[0];

    if (!data) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json({
      symbol: data.symbol,
      name: data.name,
      price: data.price,
      change: data.change,
      changesPercentage: data.changesPercentage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

router.get('/history/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`
    );

    const historical = response.data.historical.slice(-30);

    const labels = historical.map(entry => entry.date).reverse();
    const prices = historical.map(entry => entry.close).reverse();

    res.json({ labels, prices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

module.exports = router;
