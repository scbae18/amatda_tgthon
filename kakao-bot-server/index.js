const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// JSON 형태의 요청을 처리하기 위한 미들웨어 설정
app.use(bodyParser.json());

// Webhook 엔드포인트 설정
app.post('/webhook', (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    let responseText = '';

    // 사용자가 "학사"라고 입력했을 때 "안녕하세요"라는 응답을 전송
    if (userMessage === '학사') {
        responseText = '안녕하세요';
    } else {
        responseText = '다른 메시지를 입력하셨습니다.';
    }

    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": responseText
                    }
                }
            ]
        }
    };

    res.status(200).send(responseBody);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
