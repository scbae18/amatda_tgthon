const express = require('express');
const bodyParser = require('body-parser'); // 주기적인 작업을 위한 스케줄러

const app = express();
const port = 3000;

// JSON 형태의 요청을 처리하기 위한 미들웨어 설정
app.use(bodyParser.json());

// Webhook 엔드포인트: 주제 요약 기능
app.post('/webhook', (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    let responseText = '';

    if (userMessage === '학사') {
        responseText = '학사 요약 내용.';
    } else if (userMessage === '채용') {
        responseText = '채용 요약 내용.';
    } else if (userMessage === '행사') {
        responseText = '행사 요약 내용.';
    } else if (userMessage === '장학') {
        responseText = '장학 요약 내용.';
    } else {
        responseText = '주제로 구분할 수 없는 내용입니다. 기타 내용을 보여드리겠습니다.';
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

let userStates = {};

// /setKeyword 엔드포인트: 키워드 설정
app.post('/setKeyword', (req, res) => {
    const userRequest = req.body.userRequest;
    const userId = userRequest.user.id;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    let responseText = '';

    if (userMessage === '키워드 설정') {
        userStates[userId] = 'awaiting_keyword';
        responseText = '키워드를 입력하세요.';
        
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
    } 
    if (userStates[userId] === 'awaiting_keyword') {
        // 키워드 저장 처리
        database.saveKeyword(userId, userMessage, (err) => {
            if (err) {
                responseText = '키워드 저장에 실패했습니다.';
            } else {
                responseText = `키워드 '${userMessage}'가 성공적으로 설정되었습니다.`;
                delete userStates[userId]; // 상태 초기화
            }

            // 응답 보내기
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
    } else {
        responseText = '주제를 구분할 수 없습니다. "키워드 설정"을 입력하여 키워드를 설정하세요.';

        // 응답 보내기
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
    }
});

// 서버 종료 시 데이터베이스 연결 종료
process.on('SIGINT', () => {
    database.close();
    process.exit();
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});