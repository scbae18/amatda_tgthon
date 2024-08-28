const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 파일 경로 설정
const dbPath = 'C:\\Users\\scbae\\Desktop\\tgthon-1\\amatda_tgthon\\kakao-bot-server\\categorize\\notices.db';

exports.handleWebhook = (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance.trim();
    
    console.log('User message:', userMessage);

    // 데이터베이스 연결
    const db = new sqlite3.Database(dbPath);

    // 분기 처리
    if (userMessage.startsWith('원본') || userMessage.startsWith('원본 ')) {
        // 원본 요청 처리
        const noticeId = userMessage.split(' ')[1]; // '원본 [ID]' 형식
        const query = `SELECT origin FROM notices WHERE id = ?`;

        db.get(query, [noticeId], (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).send({ error: 'Internal server error' });
            } else if (row) {
                const responseBody = {
                    "version": "2.0",
                    "template": {
                        "outputs": [
                            {
                                "simpleText": {
                                    "text": row.origin
                                }
                            }
                        ]
                    }
                };

                res.status(200).send(responseBody);
            } else {
                res.status(404).send({ error: '해당 ID에 대한 원본을 찾을 수 없습니다.' });
            }

            db.close();
        });
    } else {
        // 요약본 요청 처리
        const query = `SELECT id, summary FROM notices WHERE category = ? ORDER BY created_at DESC`;

        db.all(query, [userMessage], (err, rows) => {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).send({ error: 'Internal server error' });
            } else if (rows && rows.length > 0) {
                // 데이터가 존재하는 경우 모든 요약을 하나의 문자열로 결합
                const summaries = rows.map(row => `${row.id}: ${row.summary}`).join('\n\n');

                // 응답 내용 생성
                const responseBody = {
                    "version": "2.0",
                    "template": {
                        "outputs": [
                            {
                                "simpleText": {
                                    "text": summaries + '\n\n원본을 보고 싶으시면 "원본 [ID]"를 입력해주세요.'
                                }
                            }
                        ]
                    }
                };

                // 응답 보내기
                res.status(200).send(responseBody);
            } else {
                // 데이터가 없는 경우 오류 메시지 전송
                res.status(404).send({ error: '해당 카테고리에 대한 요약을 찾을 수 없습니다.' });
            }

            db.close();
        });
    }
};
