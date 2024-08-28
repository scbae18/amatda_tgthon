// routes/setKeyword.js

const express = require('express');
const router = express.Router();
const { saveUserInput } = require('../controllers/keywordController'); // 핸들러 함수 가져오기

// POST 요청 처리 핸들러 설정
router.post('/', saveUserInput);

module.exports = router;
