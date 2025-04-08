const bachelorService = require('./bachelorService');

exports.generateResponse = async (input) => {
  let text = '';

  if (input.includes('안녕')) {
    text = '안녕하세요! 만나서 반가워요 😊';
  } else if (input.includes('학사')) {
    return await bachelorService.handleBachelor();  // 💡 async 함수일 수도 있으니 await 붙이는 게 안전
  } else {
    text = '죄송해요, 이해하지 못했어요.';
  }

  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text,
          },
        },
      ],
    },
  };
};
