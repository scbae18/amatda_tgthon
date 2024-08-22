import win32gui
import win32api
import win32con
import ctypes
import time
import pyperclip
import pywinauto
import pywinauto.keyboard as keyboard

# KakaoTalk의 메인 윈도우 제목과 클래스 이름을 설정합니다.
kakao_opentalk_name = '티지톤'

def save_text_file(file_number):
    # KakaoTalk에서 Ctrl + S로 저장 대화상자를 열기
    hwndMain = win32gui.FindWindow(None, kakao_opentalk_name)
    hwndListControl = win32gui.FindWindowEx(hwndMain, None, "EVA_VH_ListControl_Dblclk", None)
    
    # Ctrl + S를 보내서 저장 대화상자 열기
    keyboard.send_keys('^s')
    time.sleep(1)  # 대화상자가 열릴 때까지 대기

    # 파일명 입력: 숫자로 지정
    file_name = str(file_number)
    keyboard.send_keys(file_name)
    time.sleep(1)  # 파일명 입력 후 대기

    # 엔터키를 눌러 파일 저장
    keyboard.send_keys('{ENTER}')
    time.sleep(1)  # 파일 저장이 완료될 때까지 대기

    keyboard.send_keys('{ENTER}')
    time.sleep(1)  # 저장 완료 후 추가 대기

def main():
    file_number = 1

    while True:
        save_text_file(file_number)
        file_number += 1
        time.sleep(5)  # 파일 저장 사이에 대기 시간 (필요에 따라 조정)

if __name__ == '__main__':
    main()