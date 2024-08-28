const { exec } = require('child_process');
const path = require('path');

// 파일 경로 설정
const summaryScript = path.join('C:', 'Users', 'scbae', 'Desktop', 'tgthon-1', 'amatda_tgthon', 'API', 'summaryapi.js');
const categoryDataScript = path.join('C:', 'Users', 'scbae', 'Desktop', 'tgthon-1', 'amatda_tgthon', 'kakao-bot-server', 'categorize', 'categorydata.js');

// 첫 번째 파일 실행
exec(`node "${summaryScript}"`, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error executing ${summaryScript}:`, err.message);
        return;
    }
    console.log(`Output from ${summaryScript}:`, stdout);
    if (stderr) {
        console.error(`Error output from ${summaryScript}:`, stderr);
    }

    // 첫 번째 파일 실행이 끝나면 두 번째 파일 실행
    exec(`node "${categoryDataScript}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing ${categoryDataScript}:`, err.message);
            return;
        }
        console.log(`Output from ${categoryDataScript}:`, stdout);
        if (stderr) {
            console.error(`Error output from ${categoryDataScript}:`, stderr);
        }
    });
});
