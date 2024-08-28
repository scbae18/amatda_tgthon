const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로 설정
const dbPath = path.join(__dirname, 'notices.db');
const txtFilePath = 'C:\\Users\\scbae\\Desktop\\tgthon-1\\amatda_tgthon\\DATA\\summary\\output.txt'; // 텍스트 파일 경로 설정

// 데이터베이스 초기화 함수
function initializeDb() {
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        // 공지사항 테이블 생성
        db.run(`
            CREATE TABLE IF NOT EXISTS notices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                summary TEXT NOT NULL,
                korean_summary TEXT,
                english_summary TEXT,
                origin TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });

    db.close();
}

// 공지사항 추가 함수
function addNotice(category, summary, koreanSummary, englishSummary, origin) {
    const db = new sqlite3.Database(dbPath);

    const stmt = db.prepare(`
        INSERT INTO notices (category, summary, korean_summary, english_summary, origin) 
        VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(category, summary, koreanSummary, englishSummary, origin, function(err) {
        if (err) {
            console.error('Error inserting notice:', err.message);
        } else {
            console.log('Notice added with ID:', this.lastID);
        }
    });

    stmt.finalize();
    db.close();
}

// 텍스트 파일에서 공지사항 추출 함수
function parseNoticeFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err.message);
            return;
        }

        // 텍스트 데이터 파싱
        const lines = data.split('\n');
        let category = '';
        let summary = '';
        let koreanSummary = '';
        let englishSummary = '';
        let origin = '';
        let isOrigin = false;

        for (let line of lines) {
            if (line.startsWith('Category: ')) {
                category = line.substring('Category: '.length).trim();
            } else if (line.startsWith('Summary: ')) {
                summary = line.substring('Summary: '.length).trim();
            } else if (line.startsWith('Korean Summary: ')) {
                koreanSummary = line.substring('Korean Summary: '.length).trim();
            } else if (line.startsWith('English Summary: ')) {
                englishSummary = line.substring('English Summary: '.length).trim();
            } else if (line.startsWith('Origin: ')) {
                // Origin 필드 시작
                origin = line.substring('Origin: '.length).trim();
                isOrigin = true;
            } else if (isOrigin) {
                // Origin 필드가 시작된 후에는 모든 줄을 origin에 추가
                origin += '\n' + line;
            }
        }

        // 공지사항 데이터베이스에 추가
        addNotice(category, summary, koreanSummary, englishSummary, origin.trim());
    });
}

// 실행 함수
function main() {
    initializeDb();
    parseNoticeFile(txtFilePath);
}

// 실행
main();
