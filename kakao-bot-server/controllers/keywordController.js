const database = require('../database/database');

let userStates = {};

exports.setKeyword = (req, res) => {
    const userRequest = req.body.userRequest;

    if (!userRequest || !userRequest.user || !userRequest.utterance) {
        return res.status(400).send({ error: 'Invalid request format.' });
    }

    const userId = userRequest.user.id;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);
    console.log('Current userStates:', userStates);

    let responseText = '';

    // 상태가 'awaiting_keyword'일 때, 즉 사용자가 키워드를 입력해야 하는 상태일 때
    if (userStates[userId] === 'awaiting_keyword') {
        database.saveKeyword(userId, userMessage, (err) => {
            if (err) {
                console.error('Database error:', err);
                responseText = '키워드 저장에 실패했습니다.';
            } else {
                responseText = `키워드 '${userMessage}'가 성공적으로 설정되었습니다.`;
                delete userStates[userId]; // 상태 초기화
            }

            // 응답 생성 및 전송
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

        return; // 상태가 'awaiting_keyword'이면 함수 종료
    }

    // 사용자가 '키워드 설정'을 입력한 경우, 상태를 'awaiting_keyword'로 변경
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

        return res.status(200).send(responseBody);
    }

    // 상태가 아니거나, '키워드 설정'이 아닌 경우의 응답
    responseText = '주제를 구분할 수 없습니다. "키워드 설정"을 입력하여 키워드를 설정하세요.';

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
};
