const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); // 경로 관련 모듈을 포함
const database = require('./database'); // 데이터베이스 모듈을 포함

const app = express();
const port = 3000;

// JSON 형태의 요청을 처리하기 위한 미들웨어 설정
app.use(bodyParser.json());

// Webhook 엔드포인트 설정
app.post('/webhook', (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    // 분야에 따라 폴더 경로 설정
    let folderPath = '';
    if (userMessage === '학사') {
        folderPath = 'path/to/academic_folder';
    } else if (userMessage === '채용') {
        folderPath = 'path/to/recruitment_folder';
    } else if (userMessage === '행사') {
        folderPath = 'path/to/event_folder';
    } else if (userMessage === '장학') {
        folderPath = 'path/to/scholarship_folder';
    } else {
        return res.status(400).send({ error: '잘못된 분야 선택입니다.' });
    }

    // 폴더 내 모든 텍스트 파일 읽기
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('폴더 읽기 오류:', err);
            return res.status(500).send({ error: '폴더를 읽는 데 실패했습니다.' });
        }

        // 텍스트 파일만 필터링
        const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');

        // 각 파일의 내용을 읽어 결합
        const fileContents = [];
        let filesProcessed = 0;

        txtFiles.forEach(file => {
            fs.readFile(path.join(folderPath, file), 'utf8', (err, data) => {
                if (err) {
                    console.error('파일 읽기 오류:', err);
                    return res.status(500).send({ error: '파일을 읽는 데 실패했습니다.' });
                }
                fileContents.push(data);
                filesProcessed++;

                // 모든 파일을 읽었으면 응답 보내기
                if (filesProcessed === txtFiles.length) {
                    const responseBody = {
                        "version": "2.0",
                        "template": {
                            "outputs": [
                                {
                                    "simpleText": {
                                        "text": fileContents.join('\n\n') // 파일 내용 결합
                                    }
                                }
                            ]
                        }
                    };

                    res.status(200).send(responseBody);
                }
            });
        });

        // 폴더 내에 텍스트 파일이 없을 경우 처리
        if (txtFiles.length === 0) {
            const responseBody = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": '폴더에 텍스트 파일이 없습니다.'
                            }
                        }
                    ]
                }
            };
            res.status(200).send(responseBody);
        }
    });
});

let userStates = {};

// /setKeyword 엔드포인트: 키워드 설정 및 저장
app.post('/setKeyword', (req, res) => {
    const userRequest = req.body.userRequest;

    // 요청 유효성 검사
    if (!userRequest || !userRequest.user || !userRequest.utterance) {
        return res.status(400).send({ error: 'Invalid request format.' });
    }

    const userId = userRequest.user.id;
    const userMessage = userRequest.utterance; // 사용자가 입력한 메시지

    console.log('User message:', userMessage);
    console.log('Current userStates:', userStates);

    let responseText = '';

    if (userStates[userId] === 'awaiting_keyword') {
        // 상태가 'awaiting_keyword'일 때, 즉 사용자가 키워드를 입력한 경우
        // 키워드 저장 처리
        database.saveKeyword(userId, userMessage, (err) => {
            if (err) {
                console.error('Database error:', err);
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

        return; // 키워드 저장이 완료되면 여기서 함수 종료
    }

    // '키워드 설정' 명령어를 받으면 상태를 'awaiting_keyword'로 설정
    if (userMessage === '키워드 설정') {
        userStates[userId] = 'awaiting_keyword';
        responseText = '키워드를 입력하세요.';

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

        return res.status(200).send(responseBody);
    }

    // 기타 상황에 대한 응답
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
