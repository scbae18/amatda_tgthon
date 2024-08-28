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
    apiKey: ''
});

async function main() {
  const inputFilePath = path.join('C:', 'Users', 'scbae', 'Desktop', 'tgthon-1', 'amatda_tgthon', 'DATA', 'origin', 'input.txt');

    // 텍스트 파일에서 입력 읽기
  const inputText = fs.readFileSync(inputFilePath, 'utf-8');

  // OpenAI API 호출
  const completion = await openai.chat.completions.create({
    messages: [
        {"role": "system", "content": "You are an efficient text summarizer. Please summarize the text. Describe in Korean and English. Follow the next rule. First: select a category from one of the following - notice/recruitment/scholarship/event(Be sure to do as I tell you the category words.). And Make all category names in lowercase letters. Second: write a one-sentence summary that condenses everything in korean. Next: summarize the text. Describe in Korean and English. When providing a summary, be sure to add 'Category: ', 'Summary: ', 'Korean Summary: ', and 'English Summary: ' in front of each content. Third: when you make txt file, do not describe markdown. Fourth: At the end, write 'Origin: ' and then write the original input file."},
        {"role": "user", "content": inputText}
    ],
    model: "gpt-4o-mini",
  });

  // 생성된 응답 추출
  const content = completion.choices[0].message.content;

  const outputFilePath = path.join('C:', 'Users', 'scbae', 'Desktop', 'tgthon-1', 'amatda_tgthon', 'DATA', 'summary', 'output.txt');
    
  fs.writeFileSync(outputFilePath, content, 'utf-8')

  console.log("응답이 output.txt 파일에 저장되었습니다.");
}

main();
