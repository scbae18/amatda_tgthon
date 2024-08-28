const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database/database'); // 데이터베이스 모듈을 포함

const app = express();
const port = 3000;

// JSON 형태의 요청을 처리하기 위한 미들웨어 설정
app.use(bodyParser.json());

// 라우트 설정
const webhookRoutes = require('./routes/webhook');
const keywordRoutes = require('./routes/keyword');

app.use('/webhook', webhookRoutes);
app.use('/keyword', keywordRoutes);

// 서버 종료 시 데이터베이스 연결 종료
process.on('SIGINT', () => {
    database.close();
    process.exit();
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
