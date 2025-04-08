exports.generateResponse = (input) => {
    let text = '';
  
    if (input.includes('안녕')) {
      text = '안녕하세요! 만나서 반가워요 😊';
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
  