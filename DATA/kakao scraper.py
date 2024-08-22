import win32gui
import os
import win32api
import win32con
import ctypes
import time
import pyperclip
import pywinauto
import pywinauto.keyboard as keyboard

# KakaoTalk의 메인 윈도우 제목과 클래스 이름을 설정합니다.
kakao_opentalk_name = '티지톤'
save_directory = 'C:\\Users\\samsung\\Desktop\\kakaotalk\\'

def read_file(file_path):
    """파일을 읽어 문자열을 반환합니다."""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    return ""

def save_diff_file(file_number, additional_content):
    """추가된 내용만을 diff 파일로 저장합니다."""
    diff_file_name = f"diff_{file_number}.txt"
    diff_file_path = os.path.join(save_directory, diff_file_name)
    
    with open(diff_file_path, 'w', encoding='utf-8') as diff_file:
        diff_file.write(additional_content)
    print(f"Additional content saved to {diff_file_path}.")

def save_text_file(file_number):
    """텍스트 파일을 저장하고 추가된 내용만을 diff 파일로 저장합니다."""
    # KakaoTalk에서 Ctrl + S로 저장 대화상자를 열기
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

    # 추가된 내용이 있는 경우에만 diff 파일로 저장
    if additional_content:
        save_diff_file(file_number, additional_content)
    else:
        print(f"No new content detected. File {full_file_name} is unchanged.")

def main():
    file_number = 1

    while True:
        save_text_file(file_number)
        file_number += 1
        time.sleep(5)  # 파일 저장 사이에 대기 시간 (필요에 따라 조정)

if __name__ == '__main__':
    main()