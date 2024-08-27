const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');

// 키워드 설정 라우트
router.post('/', keywordController.setKeyword);

module.exports = router;
