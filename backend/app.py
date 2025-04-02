from fastapi import FastAPI
import psycopg2
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# เชื่อมต่อกับ PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB", "mydb"),
        user=os.getenv("POSTGRES_USER", "admin"),
        password=os.getenv("POSTGRES_PASSWORD", "1234"),
        host="db",
        port="5432"
    )

@app.get("/results")
def get_results():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM results ORDER BY received_at DESC LIMIT 10;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return {"results": rows}



