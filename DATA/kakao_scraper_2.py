import pyautogui
import time
from datetime import datetime
import os
import win32gui
import re

def focus_kakao_window():
    kakao_window = win32gui.FindWindow(None, '티지톤')
    if kakao_window != 0:
        win32gui.SetForegroundWindow(kakao_window)
    else:
        print("카카오톡 창을 찾을 수 없습니다.")
        return False
    return True

def save_kakao_chat():
    if not focus_kakao_window():
        return
    
    pyautogui.hotkey('ctrl', 's')
    
    current_time = datetime.now().strftime('%Y_%m%d_%H%M_%S')
    save_path = os.path.join('C:\\Users\\samsung\\Desktop\\kakaotalk', current_time + '.txt')
    
    time.sleep(1)
    pyautogui.typewrite(save_path, interval=0.01)
    time.sleep(1)
    pyautogui.press('enter')
    time.sleep(1)
    pyautogui.press('enter')
    
    remove_square_brackets(save_path)
    remove_second_line(save_path)
    process_new_chat_files(save_path)

def remove_square_brackets(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    cleaned_content = re.sub(r'\[\s*[^]]*\s*\]\s*', '', content)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(cleaned_content)

def remove_second_line(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    # Remove the second line if it exists
    if len(lines) > 1:
        lines.pop(1)
    
    # Write the remaining lines back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(lines)

def process_new_chat_files(new_file_path):
    old_folder = 'C:\\Users\\samsung\\Desktop\\kakaotalk'
    new_folder = 'C:\\Users\\samsung\\Desktop\\kakaotalk\\new'
    files = sorted([f for f in os.listdir(old_folder) if f.endswith('.txt')])

    # 정렬된 파일 목록 출력
    print("정렬된 파일 목록:")
    for file in files:
        print(file)
    
    if len(files) < 2:
        return
    
    # 새 파일이 가장 최근 파일인지 확인
    if files[-1] != os.path.basename(new_file_path):
        return
    
    previous_file_path = os.path.join(old_folder, files[-2])
    
    # 모든 줄을 비교하여 추가된 내용 추출
    if not compare_last_lines(previous_file_path, new_file_path):
        extract_new_lines(previous_file_path, new_file_path, new_folder)

def compare_last_lines(file1, file2):
    # Read all lines from file1
    with open(file1, 'r', encoding='utf-8') as f1:
        lines1 = f1.readlines()
    
    # Read all lines from file2
    with open(file2, 'r', encoding='utf-8') as f2:
        lines2 = f2.readlines()
    
    # Get the last line of each file
    last_line1 = lines1[-1] if lines1 else ""
    last_line2 = lines2[-1] if lines2 else ""
    
    # Print the last lines for debugging
    print(f"Last line of {file1}: {last_line1.strip()}")
    print(f"Last line of {file2}: {last_line2.strip()}")
    
    return last_line1 == last_line2

def extract_new_lines(old_file, new_file, new_folder):
    with open(old_file, 'r', encoding='utf-8') as old, open(new_file, 'r', encoding='utf-8') as new:
        old_lines = old.readlines()
        new_lines = new.readlines()
    
    if old_lines:
        last_line_old = old_lines[-1].strip()
        # Find the index of the most recent occurrence of the last_line_old
        start_index = 0
        for i in reversed(range(len(new_lines))):
            if new_lines[i].strip() == last_line_old:
                start_index = i + 1
                break
    else:
        start_index = 0

    # Get lines in new_lines after the last occurrence of last_line_old
    new_content = ''.join(new_lines[start_index:])
    
    if new_content:
        new_file_time = datetime.now().strftime('%Y_%m%d_%H%M_%S')
        new_file_path = os.path.join(new_folder, 'new_' + new_file_time + '.txt')
        
        with open(new_file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

def main():
    while True:
        save_kakao_chat()
        time.sleep(10)

if __name__ == "__main__":
    main()
