# References:
# https://www.geeksforgeeks.org/python/how-to-add-authentication-to-your-app-with-flask-login/
# https://www.youtube.com/watch?v=3NEzo3CfbPg
# - Flask JSON Formatting: https://flask.palletsprojects.com/en/2.3.x/api/#flask.json.jsonify
# - SQLite3 Python Integration: https://docs.python.org/3/library/sqlite3.html
# - Flask-CORS documentation: https://flask-cors.readthedocs.io/en/latest/


import sqlite3
import hashlib
import random
from flask import Flask, render_template, request, url_for, session, redirect, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user


LOGIN_PAGE = '/login'
LOGOUT_PAGE = '/logout'
REGISTER_PAGE = '/register'


# TODO: These are placeholders, we can make something more secure later using environment files. 
SERVER_IP = 'localhost'
SERVER_PORT = 5150
app = Flask(__name__)
app.secret_key = 'secret_key'


# Flask needs this stuff for individual user sessions. 
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


# User Class, flask needs this defined for each user.
class User(UserMixin):
  def __init__(self, row):
    self.id = str(row["uid"])
    self.display_name = row["display_name"]


# Talks to the database. 
def db():
  conn = sqlite3.connect("orbit.db")
  conn.row_factory = sqlite3.Row
  return conn


# Load the user for flask to handle the user session. 
@login_manager.user_loader
def load_user(uid, ):
  with db() as conn:
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE uid = ?",
                (uid, ))
    user_id = cur.fetchone()

  if user_id is None: 
    return None
  
  return User(user_id)




# =====================================
# Page Routing
#
# Flask renders and talks to each page 
# here. This can double as an auth system
# and an api. 
# =====================================
@app.route("/")
def index():
  return render_template("index.html")


@app.route(REGISTER_PAGE, methods=["GET", "POST"])
def register():
  email_address = ""
  password = ""
  display_name = ""


  if request.method == "POST":
    email_address = request.form["email"].strip().lower()
    display_name = request.form["username"].strip()
    password = request.form["password"]

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    uid = random.randint(1000000000, 9999999999)

    conn = db()
    try:
      with conn:
        conn.execute(
          """
          INSERT INTO users (uid, display_name, password, email_address)
          VALUES (?, ?, ?, ?)
          """,
          (uid, display_name, password_hash, email_address)
        )
    except sqlite3.IntegrityError:
      return render_template("register.html", error="Email already registered")
    finally: 
      conn.close()


    return redirect(url_for("login"))

  else: 
    return render_template("register.html")
  

@app.route(LOGIN_PAGE, methods=["GET", "POST"])
def login():
  if request.method == "GET":
    return render_template("login.html")
  
  email_address = request.form.get("email", "").strip().lower()
  password = request.form.get("password", "")
  
  password_hash = hashlib.sha256(password.encode()).hexdigest()


  with db() as conn:
    cur = conn.cursor()

    # Query the databse to find if the user exists
    cur.execute(
        """
        SELECT uid, email_address, password, failed_attempts, locked_until, display_name
        FROM users
        WHERE email_address = ?
        """,
        (email_address, )
    )


    # Store the found user
    queried_user = cur.fetchone()
    

    if queried_user is None:
      return render_template("login.html", error="User not found")
    else:
      uid, email_address, queried_password, failed_attempts, locked_until, display_name = queried_user


    if failed_attempts >= 10:
      # TODO: This is temporary to ensure we don't lock outselves out. Remove this when there is a method of resetting an account. 
      cur.execute(
        """
        UPDATE users
        SET failed_attempts = 0
        WHERE uid = ?
        """,
        (uid, )
      )
      return render_template("login.html", error="Too many failed attempts. TEMPORARY: Failed attempts reset to 0.")


    # Check validity of the password
    if queried_password == password_hash:
      login_user(User(queried_user))
      conn.execute(
          """
          UPDATE users
          SET failed_attempts = 0
          WHERE uid = ?
          """,
          (uid, )
      )
      conn.commit()
      return render_template("login.html", error="Successfully logged in.")
      # TODO: Will update later to contain necessary redirect (waiting on team member to complete it.)
      # return redirect(url_for("home"))

    # Failed Password
    else: 
      conn.execute(
          """
          UPDATE users
          SET failed_attempts = failed_attempts + 1
          WHERE uid = ?
          """,
          (uid,)
          )
      conn.commit()
      return render_template("login.html", error="Invalid password")
    

# =====================================
# Location API
# =====================================

@app.route('/api/locations', methods=['GET'])
def get_locations():
    with db() as conn:
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                address TEXT,
                description TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')
        cur.execute("SELECT * FROM locations")
        rows = cur.fetchall()
        return jsonify([dict(row) for row in rows])

@app.route('/api/locations', methods=['POST'])
def add_location():
    data = request.get_json() or {}
    with db() as conn:
        cur = conn.cursor()
        cur.execute('''
            INSERT INTO locations (name, category, address, description, status, created_at)
            VALUES (?, ?, ?, ?, 'active', date('now'))
        ''', (
            data.get('name', 'Unknown'),
            data.get('category', 'Uncategorized'),
            data.get('address', ''),
            data.get('description', '')
        ))
        conn.commit()
    return jsonify({"message": "Location added successfully"}), 201

if __name__ == '__main__':
    app.run(host=SERVER_IP, port=SERVER_PORT, debug=True)



