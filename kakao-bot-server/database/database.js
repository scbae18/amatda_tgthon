const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로 설정
const dbPath = path.join(__dirname, 'database.db');

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('데이터베이스 연결 오류:', err.message);
    } else {
        console.log('데이터베이스 연결 성공');
        // 테이블이 존재하지 않으면 생성
        db.run(`CREATE TABLE IF NOT EXISTS userInputs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            firstKeyword TEXT,
            secondKeyword TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS userStates (
            userId TEXT PRIMARY KEY,
            state TEXT NOT NULL,
            firstKeyword TEXT
        )`);
    }
});

// 사용자 상태 저장 함수
exports.saveUserState = (userId, state, firstKeyword, callback) => {
    const sql = `INSERT OR REPLACE INTO userStates (userId, state, firstKeyword) VALUES (?, ?, ?)`;
    db.run(sql, [userId, state, firstKeyword], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

// 사용자 상태 가져오기 함수
exports.getUserState = (userId, callback) => {
    const sql = `SELECT state, firstKeyword FROM userStates WHERE userId = ?`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

// 키워드 저장 함수
exports.saveKeywords = (userId, firstKeyword, secondKeyword, callback) => {
    const sql = `INSERT INTO userInputs (userId, firstKeyword, secondKeyword) VALUES (?, ?, ?)`;
    db.run(sql, [userId, firstKeyword, secondKeyword], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

// 데이터베이스 연결 종료 함수
exports.close = () => {
    db.close((err) => {
        if (err) {
            console.error('데이터베이스 종료 오류:', err.message);
        } else {
            console.log('데이터베이스 종료 성공');
        }
    });
};
