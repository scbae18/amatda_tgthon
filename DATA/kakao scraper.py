import os
import time
import mysql.connector
from datetime import datetime
import win32gui
import pywinauto.keyboard as keyboard
import re

# KakaoTalk의 메인 윈도우 제목과 클래스 이름을 설정합니다.
kakao_opentalk_name = '티지톤'
save_directory = 'C:\\Users\\samsung\\Desktop\\kakaotalk\\'

def read_file(file_path):
    """파일을 읽어 문자열을 반환합니다."""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    return ""

def clean_text(text):
    """
    텍스트에서 특정 형식의 문자열을 제거합니다.
    예: [이동찬] [오후 3:04] 2 -> 2
    """
    # 정규 표현식 패턴 정의
    pattern = r'\[\w+\] \[\w+ \d{1,2}:\d{2}\] '
    
    # 정규 표현식으로 패턴에 맞는 부분 제거
    cleaned_text = re.sub(pattern, '', text)
    
    return cleaned_text

def save_diff_file(file_number, additional_content):
    """추가된 내용만을 diff 파일로 저장합니다."""
    diff_file_name = f"diff_{file_number}.txt"
    diff_file_path = os.path.join(save_directory, diff_file_name)
    
    # 추가된 내용의 앞뒤 공백 제거 및 정리
    cleaned_content = clean_text(additional_content).strip()
    
    with open(diff_file_path, 'w', encoding='utf-8') as diff_file:
        diff_file.write(cleaned_content)
    print(f"Additional content saved to {diff_file_path}.")
    return diff_file_path

def save_text_file(file_number):
    """텍스트 파일을 저장하고 추가된 내용만을 diff 파일로 저장합니다."""
    hwndMain = win32gui.FindWindow(None, kakao_opentalk_name)
    hwndListControl = win32gui.FindWindowEx(hwndMain, None, "EVA_VH_ListControl_Dblclk", None)

    # 파일 경로 설정
    full_file_name = f"{file_number}.txt"
    full_file_path = os.path.join(save_directory, full_file_name)

    # 이전 파일의 내용 읽기
    previous_content = ""
    if file_number > 1:
        previous_file_path = os.path.join(save_directory, f"{file_number - 1}.txt")
        previous_content = read_file(previous_file_path)

    # Ctrl + S를 보내서 저장 대화상자를 열기
    keyboard.send_keys('^s')
    time.sleep(1)  # 대화상자가 열릴 때까지 대기

    # 파일명 입력: 숫자로 지정
    keyboard.send_keys(full_file_name)
    time.sleep(1)  # 파일명 입력 후 대기

    # 엔터키를 눌러 파일 저장
    keyboard.send_keys('{ENTER}')
    time.sleep(1)  # 파일 저장이 완료될 때까지 대기

    # 저장되었습니다 창이 열리면 엔터키를 눌러 닫기
    keyboard.send_keys('{ENTER}')
    time.sleep(1)  # 저장 완료 후 추가 대기

    # 새 파일의 내용을 읽기
    new_content = read_file(full_file_path)

    # 추가된 내용 추출
    additional_content = new_content[len(previous_content):]

    # 추가된 내용이 있는 경우에만 파일 저장 및 diff 파일로 저장
    if additional_content.strip():  # 추가된 내용이 있는 경우
        cleaned_content = clean_text(additional_content).strip()
        diff_file_path = save_diff_file(file_number, cleaned_content)
        insert_data_into_db(file_path=full_file_path, content=cleaned_content)
    else:
        os.remove(full_file_path)  # 내용이 같으면 새로 저장된 파일 삭제
        print(f"No new content detected. File {full_file_name} has been deleted.")

def insert_data_into_db(file_path, content):
    """MySQL 데이터베이스에 텍스트 데이터를 삽입합니다."""
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="qzwxec!&93",  # MySQL 설치 시 설정한 비밀번호
        database="kakao_talk_db"
    )
    cursor = db.cursor()

    category = "공지사항"  # 카테고리를 어떻게 정할지는 내용 분석에 따라 달라질 수 있음
    created_at = datetime.now()

    # MySQL 테이블에 데이터 삽입
    sql = "INSERT INTO notices (category, content, created_at) VALUES (%s, %s, %s)"
    val = (category, content, created_at)
    cursor.execute(sql, val)
    
    db.commit()
    cursor.close()
    db.close()
    print(f"Content from {file_path} has been inserted into the database.")

def main():
    file_number = 1

    while True:
        save_text_file(file_number)
        file_number += 1
        time.sleep(5)  # 파일 저장 사이에 대기 시간 (필요에 따라 조정)

if __name__ == '__main__':
    main()
