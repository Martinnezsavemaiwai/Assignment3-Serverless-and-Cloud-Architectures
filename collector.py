import pika
import psycopg2
import os

# เชื่อมต่อกับ PostgreSQL
conn = psycopg2.connect(
    dbname=os.getenv("POSTGRES_DB", "postgres"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", "password"),
    host="localhost", 
    port="5432"
)
cur = conn.cursor()

# สร้างตารางถ้ายังไม่มี
cur.execute("""
    CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        data TEXT NOT NULL,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
""")
conn.commit()

# เชื่อมต่อกับ RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='result_queue', durable=True)

def callback(ch, method, properties, body):
    data = body.decode()
    print(f"Collector received: {data}")

    # ตัดคำตั้งแต่ "processed" เป็นต้นไป
    if "processed" in data:
        data = data.split("processed")[0].strip()

    print(f"Modified data: {data}")

    # บันทึกลงฐานข้อมูล
    cur.execute("INSERT INTO results (data) VALUES (%s)", (data,))
    conn.commit()

    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='result_queue', on_message_callback=callback)

print("Waiting for results...")
channel.start_consuming()
