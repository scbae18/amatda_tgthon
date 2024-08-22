const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 연결
const db = new sqlite3.Database('./keywords.db');

// 테이블 생성 (만약 테이블이 없으면 생성)
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS user_keywords (user_id TEXT, keyword TEXT)");
});

// 키워드 저장 함수
function saveKeyword(userId, keyword, callback) {
    db.run("INSERT INTO user_keywords (user_id, keyword) VALUES (?, ?)", [userId, keyword], (err) => {
        callback(err);
    });
}

// 데이터베이스 종료
function close() {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

module.exports = { saveKeyword, close };
