const { getSummaryByTopic } = require('C:\Users\scbae\Desktop\tgthon-1\amatda_tgthon\sum_database\db.js'); // db.js의 경로에 맞게 조정

exports.handleWebhook = (req, res) => {
  const userRequest = req.body.userRequest;
  const userMessage = userRequest.utterance;

  console.log('User message:', userMessage);

  // 주제에 따른 요약 조회
  getSummaryByTopic(userMessage, (err, summary) => {
    if (err) {
      console.error('Error fetching summary:', err.message);
      return res.status(500).send({ error: '서버 오류가 발생했습니다.' });
    }

    // 응답 내용 생성
    const responseBody = {
      "version": "2.0",
      "template": {
        "outputs": [
          {
            "simpleText": {
              "text": summary
            }
          }
        ]
      }
    };

    // 응답 보내기
    res.status(200).send(responseBody);
  });
};
