import mysql.connector
from datetime import datetime

def insert_data_into_db(content):
    """MySQL 데이터베이스에 텍스트 데이터를 삽입합니다."""
    cursor = None
    db = None
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="qzwxec!&93",
            database="kakao_talk_db"
        )
        cursor = db.cursor()

        # 예시 카테고리
        category = "공지사항"
        created_at = datetime.now()

        sql = "INSERT INTO notices (category, content, created_at) VALUES (%s, %s, %s)"
        val = (category, content, created_at)
        cursor.execute(sql, val)
        
        db.commit()
        print(f"Inserted {cursor.rowcount} row(s) into notices table.")
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# 예시 데이터 삽입
insert_data_into_db("여기에 공지 내용이 들어갑니다.")