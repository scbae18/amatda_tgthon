const express = require('express');
const bodyParser = require('body-parser');
const webhookRouter = require('./routes/webhook');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const apiKey = process.env.KAKAO_API_KEY;

console.log(`포트: ${PORT}, 카카오 API 키: ${apiKey}`);

const app = express();

app.use(bodyParser.json());
app.use('/webhook', webhookRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
