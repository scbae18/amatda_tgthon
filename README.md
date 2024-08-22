# amatda_t.g.thon

카카오톡 챗봇 서버 연결 방법
1. node.js -> 서버 파일 index.js 코드 작성(webhook 엔드포인트 설정)
2. powershell -> ngrok 오픈
3. ngrok 서버 인증토큰 등록(ngrok config add-authtoken YOUR_AUTHTOKEN)
4. 로컬 서버 실행(ex. node index.js)
5. powershell(ngrok) -> ngrok 명령어 실행 -> ngrok http 3000(로컬서버 번호)
6. 챗봇 webhook 스킬등록 -> url에 ngrok 명령어 실행 후 나온 주소 작성(webhook 엔드포인트 추가(/webhook))
7. 스킬서버에 전송 후 전송 여부 확인
8. 확인하고자 하는 블록에 스킬 등록 후 봇 응답에 스킬 데이터 사용으로 설정
9. 봇 테스트
10. 서버 종료 시 ngrok 환경 및 로컬 서버 환경에 ctrl + c
