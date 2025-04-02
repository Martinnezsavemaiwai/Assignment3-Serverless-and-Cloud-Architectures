# ใช้ Python 3.10 เป็น base image
FROM python:3.10

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ requirement
COPY requirements.txt .

# ติดตั้ง dependencies
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ดทั้งหมด
COPY . .

# รัน FastAPI บน Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
