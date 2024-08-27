import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: 'your_api_key'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
        {"role": "system", "content": "You are a efficient text summarizer. please summary the text. describe in korean and english. And first write a one-sentence summary that condenses everything."},
        {"role": "user", "content": "🔥24-2 티지윙 참여식/강의식 스터디 개설 공지🔥 모두 방학 잘 보내고 계시나요? 24년 2학기 티지윙 스터디 개설 공지드립니다! 👤개설 대상👤 - 자신이 원하는 스터디가 개설되어 있지 않으신 분 (개설 현황은 노션을 참고해 주세요) - 자신의 능력을 학우분들을 위해 사용해 주실 분 (강의식) ⏳️스터디 진행 일정⏳️ 스터디 개설 모집: 8/19 ~ 9/6 스터디 참여 모집: 8/28 ~ 9/6 스터디 시작 : 9/9~ ✅️스터디 개설 방법✅️ 9/6일까지 강의식, 참여식 스터디를 열고 싶은 분은 기획서를 작성하여 교육부장에게 보내주면 됩니다! (010-3921-9454 교육부장 권구현) 🏆지원 안내🏆 - 강의식 스터디장에게는 소정의 강의비를 지원해 드립니다. - 참여식 스터디에는 인원 비례 회식비를 지원해 드립니다. - 참여식 우수팀에게는 추가 상금이 있습니다! - 단, 모든 지원은 스터디 완주시 방학 중 지급됩니다. (자세한 완주 기준은 노션에 있습니다.) ℹ️개설 안내ℹ️ - 기획안에는 주제, 목표, 계획 등의 내용이 들어가야 하며 학우분들이 어떤 스터디인지 알 수 있어야 합니다. - 스터디는 전공 관련 스터디는 모두 가능합니다. (e.g. 스프링, 백준 스터디, 자료구조 등) 노션: https://tgwing.notion.site/2024-1964175444b44e618699a0fda2aad50b 자세한 내용은 노션을 참고해 주세요!"},
        //{"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        //{"role": "user", "content": "Where was it played?"}
        ],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}
main();