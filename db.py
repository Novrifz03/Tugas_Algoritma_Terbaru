import sqlite3

conn = sqlite3.connect("database.db")
cur = conn.cursor()

# TABEL USER
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
""")

# TABEL MAHASISWA (KOSONG DIAWAL)
cur.execute("""
CREATE TABLE IF NOT EXISTS mahasiswa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nim TEXT,
    nama TEXT,
    jurusan TEXT
)
""")

conn.commit()
conn.close()

print("Database & tabel berhasil dibuat")
