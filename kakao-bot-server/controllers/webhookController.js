exports.handleWebhook = (req, res) => {
    const userRequest = req.body.userRequest;
    const userMessage = userRequest.utterance;

    console.log('User message:', userMessage);

    // 분야에 따라 출력할 메시지 설정
    let summaryMessage = '';
    switch (userMessage) {
        case '학사':
            summaryMessage = '학사 요약입니다.';
            break;
        case '채용':
            summaryMessage = '채용 요약입니다.';
            break;
        case '행사':
            summaryMessage = '행사 요약입니다.';
            break;
        case '장학':
            summaryMessage = '장학 요약입니다.';
            break;
        default:
            return res.status(400).send({ error: '잘못된 분야 선택입니다.' });
    }

    // 응답 내용 생성
    const responseBody = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": summaryMessage
                    }
                }
            ]
        }
    };

    // 응답 보내기
    res.status(200).send(responseBody);
};
