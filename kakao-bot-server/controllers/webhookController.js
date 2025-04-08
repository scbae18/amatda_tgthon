const { generateResponse } = require('../services/chatbotService');

exports.handleKakaoRequest = (req, res) => {
  const userInput = req.body.userRequest.utterance;
  const response = generateResponse(userInput);
  res.json(response);
};
