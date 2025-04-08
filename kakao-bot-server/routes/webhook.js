const express = require('express');
const router = express.Router();
const { handleKakaoRequest } = require('../controllers/webhookController');

router.post('/', handleKakaoRequest);

module.exports = router;
