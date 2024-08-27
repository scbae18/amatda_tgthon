const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 연결
const db = new sqlite3.Database('./keywords.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// 테이블 생성 (만약 테이블이 없으면 생성)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user_keywords (
            user_id TEXT NOT NULL,
            keyword TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "user_keywords" is ready.');
        }
    });
});

// 키워드 저장 함수
function saveKeyword(userId, keyword, callback) {
    const sql = "INSERT INTO user_keywords (user_id, keyword) VALUES (?, ?)";
    db.run(sql, [userId, keyword], function (err) {
        if (err) {
            console.error('Error inserting keyword:', err.message);
        }
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
