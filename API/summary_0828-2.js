import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// 현재 모듈의 디렉토리 경로 계산
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
    apiKey: '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'
});

async function main() {
  // 텍스트 파일에서 입력 읽기
  const inputFilePath = path.join(__dirname, 'input.txt');
  const inputText = fs.readFileSync(inputFilePath, 'utf-8');

  // OpenAI API 호출
  const completion = await openai.chat.completions.create({
    messages: [
        {"role": "system", "content": "You are an efficient text summarizer. Please summarize the text. Describe in Korean and English. Follow the next rule. First: select a category from one of the following - notice/recruit/scholarship/event. Second: write a one-sentence summary that condenses everything. Next: summarize the text. Describe in Korean and English."},
        {"role": "user", "content": inputText}
    ],
    model: "gpt-4o-mini",
  });

  // 생성된 응답 추출
  const content = completion.choices[0].message.content;

  // 응답을 output.txt 파일로 저장
  fs.writeFileSync('output.txt', content, 'utf-8');

  console.log("응답이 output.txt 파일에 저장되었습니다.");
}

main();
