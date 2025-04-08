const { generateResponse } = require('../services/chatbotService');

exports.handleKakaoRequest = async (req, res) => {
  const userInput = req.body.userRequest.utterance;
  const response = await generateResponse(userInput);
  res.json(response);
};
