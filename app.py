from flask import Flask, render_template, request, redirect, session
import sqlite3

app = Flask(__name__)
app.secret_key = "rahasia123"

# ================= DATABASE =================
def get_db():
    return sqlite3.connect("database.db")

def init_db():
    db = get_db()
    cur = db.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS mahasiswa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nim TEXT,
        nama TEXT,
        jurusan TEXT
    )
    """)

    db.commit()
    db.close()


# ================= LOGIN =================
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        db = get_db()
        cur = db.cursor()
        cur.execute(
            "SELECT * FROM users WHERE username=? AND password=?",
            (username, password)
        )
        user = cur.fetchone()
        db.close()

        if user:
            session["user"] = username
            return redirect("/dashboard?msg=login")
        else:
            return redirect("/?msg=login_failed")

    return render_template("login.html")

# ================= REGISTER =================
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        db = get_db()
        cur = db.cursor()

        cur.execute("SELECT * FROM users WHERE username=?", (username,))
        if cur.fetchone():
            db.close()
            return redirect("/register?msg=register_failed")

        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password)
        )
        db.commit()
        db.close()

        return redirect("/?msg=register")

    return render_template("register.html")



# ================= LOGOUT =================
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/?msg=logout")

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/")

    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT * FROM mahasiswa")
    data = cur.fetchall()
    db.close()

    return render_template("dashboard.html", data=data)


@app.route("/tambah", methods=["POST"])
def tambah():
    if "user" not in session:
        return redirect("/")

    nim = request.form["nim"]
    nama = request.form["nama"]
    jurusan = request.form["jurusan"]

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "INSERT INTO mahasiswa (nim, nama, jurusan) VALUES (?, ?, ?)",
        (nim, nama, jurusan)
    )
    db.commit()
    db.close()

    return redirect("/dashboard?msg=tambah")

# ================= HAPUS MAHASISWA =================
@app.route("/hapus/<int:id>")
def hapus(id):
    if "user" not in session:
        return redirect("/")

    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM mahasiswa WHERE id = ?", (id,))
    db.commit()
    db.close()

    return redirect("/dashboard?msg=hapus")



if __name__ == "__main__":
    init_db()
    app.run(debug=True)

