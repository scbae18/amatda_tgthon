const database = require('../database/database');

exports.saveUserInput = (req, res) => {
    const userRequest = req.body.userRequest;

    if (!userRequest || !userRequest.user || !userRequest.utterance) {
        return res.status(400).send({ error: 'Invalid request format.' });
    }

    const userId = userRequest.user.id;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    database.getUserState(userId, (err, userState) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ error: 'Internal server error.' });
        }

        let responseText = '';

        if (!userState) {
            // 초기 상태: 'idle'
            if (userMessage === '키워드 설정') {
                // 상태를 'awaiting_first_keyword'로 변경
                database.saveUserState(userId, 'awaiting_first_keyword', null, (err) => {
                    if (err) {
                        console.error('Database error:', err);
                        responseText = '상태 설정에 실패했습니다.';
                    } else {
                        responseText = '첫 번째 키워드를 입력하세요.';
                    }
                    sendResponse(res, responseText);
                });
            } else {
                responseText = '입력하신 메시지는 처리되지 않았습니다. "키워드 설정"을 입력하여 키워드를 설정하세요.';
                sendResponse(res, responseText);
            }
        } else if (userState.state === 'awaiting_first_keyword') {
            // 첫 번째 키워드 저장
            database.saveUserState(userId, 'awaiting_second_keyword', userMessage, (err) => {
                if (err) {
                    console.error('Database error:', err);
                    responseText = '첫 번째 키워드 저장에 실패했습니다.';
                } else {
                    responseText = '두 번째 키워드를 입력하세요.';
                }
                sendResponse(res, responseText);
            });
        } else if (userState.state === 'awaiting_second_keyword') {
            // 두 번째 키워드 저장
            database.saveKeywords(userId, userState.firstKeyword, userMessage, (err) => {
                if (err) {
                    console.error('Database error:', err);
                    responseText = '키워드 저장에 실패했습니다.';
                } else {
                    responseText = `첫 번째 키워드 '${userState.firstKeyword}'와 두 번째 키워드 '${userMessage}'가 성공적으로 저장되었습니다.`;
                    // 상태 초기화
                    database.saveUserState(userId, 'idle', null, (err) => {
                        if (err) console.error('Error resetting user state:', err);
                    });
                }
                sendResponse(res, responseText);
            });
        } else {
            // 기타 상태나 메시지
            responseText = '입력하신 메시지는 처리되지 않았습니다. "키워드 설정"을 입력하여 키워드를 설정하세요.';
            sendResponse(res, responseText);
        }
    });
};

function sendResponse(res, text) {
    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": text
                    }
                }
            ]
        }
    };
    res.status(200).send(responseBody);
}
