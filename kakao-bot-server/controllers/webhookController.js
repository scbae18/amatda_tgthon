const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 파일 경로 설정
const dbPath = 'C:\\Users\\scbae\\Desktop\\tgthon-1\\amatda_tgthon\\kakao-bot-server\\categorize\\notices.db';

exports.handleWebhook = (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    // SQLite 데이터베이스 연결
    const db = new sqlite3.Database(dbPath);

    // SQL 쿼리 생성
    const query = `SELECT summary FROM notices WHERE category = ? ORDER BY created_at DESC`;

    // 데이터베이스에서 카테고리에 해당하는 모든 공지사항 요약 가져오기
    db.all(query, [userMessage], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send({ error: 'Internal server error' });
        } else if (rows && rows.length > 0) {
            // 데이터가 존재하는 경우 모든 요약을 하나의 문자열로 결합
            const summaries = rows.map(row => row.summary).join('\n\n');

            // 응답 내용 생성
            const responseBody = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": summaries
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

        // 데이터베이스 연결 종료
        db.close();
    });
};
