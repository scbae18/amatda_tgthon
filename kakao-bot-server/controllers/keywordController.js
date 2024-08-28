const sqlite3 = require('sqlite3').verbose();
const dbPath = 'C:\\Users\\scbae\\Desktop\\tgthon-1\\amatda_tgthon\\kakao-bot-server\\categorize\\notices.db';

// 사용자 입력 처리 및 키워드 검색
exports.saveUserInput = (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance.trim();

    console.log('User message:', userMessage);

    // 데이터베이스 연결
    const db = new sqlite3.Database(dbPath);

    // 키워드로 origin 검색
    const query = `SELECT id, summary FROM notices WHERE origin LIKE '%' || ? || '%' ORDER BY created_at DESC`;

    db.all(query, [userMessage], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            db.close(); // 에러 발생 시 데이터베이스 연결 종료
            return res.status(500).send({ error: 'Internal server error' });
        }

        if (rows.length > 0) {
            const summaries = rows.map(row => `${row.id}: ${row.summary}`).join('\n\n');
            const responseBody = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": `${summaries}`
                            }
                        }
                    ]
                }
            };
            db.close(); // 데이터베이스 연결 종료
            return res.status(200).send(responseBody);
        } else {
            const responseBody = {
                "version": "2.0",
                "template": {
                    "outputs": [
                        {
                            "simpleText": {
                                "text": '해당 키워드에 대한 요약을 찾을 수 없습니다.'
                            }
                        }
                    ]
                }
            };
            db.close(); // 데이터베이스 연결 종료
            return res.status(404).send(responseBody);
        }
    });
};
