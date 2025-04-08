exports.handleBachelor = () => {
    const responseText = '학사 기능입니다. 성적 조회, 수강 신청 등 어떤 걸 도와드릴까요?';
  
    return {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: responseText,
            },
          },
        ],
      },
    };
  };
  