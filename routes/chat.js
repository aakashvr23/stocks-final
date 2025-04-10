const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  let reply = "I'm not sure about that. Try asking about NIFTY or TCS.";

  if (msg.includes('nifty')) {
    reply = "NIFTY is currently around 22,000 points.";
  } else if (msg.includes('mutual funds')) {
    reply = "Some top mutual funds in India include Axis Bluechip, ICICI Prudential, and HDFC Top 100.";
  } else if (msg.includes('tcs')) {
    reply = "TCS stock is currently trading at ₹3,200 (example value).";
  }

  res.json({ reply });
});

module.exports = router;
