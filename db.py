# db.py
# initializes the database for orbit.

import asyncio
import aiosqlite
import os
import sys



# =====================================
# Schema_Statements
# =====================================
SCHEMA_STATEMENTS = [
    "PRAGMA foreign_keys = ON;",

    """
    CREATE TABLE IF NOT EXISTS users (
        uid             TEXT PRIMARY KEY,
        display_name    TEXT NOT NULL,
        bio             TEXT,
        interests       TEXT DEFAULT '[]',
        created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
    """,


    """
    CREATE TABLE IF NOT EXISTS locations (
        id              TEXT PRIMARY KEY,
        submitted_by    TEXT REFERENCES users(uid) ON DELETE SET NULL,
        name            TEXT NOT NULL,
        description     TEXT,
        category        TEXT NOT NULL,
        hobby_tags      TEXT DEFAULT '[]',
        atmosphere_tags TEXT DEFAULT '[]',
        address         TEXT,
        latitude        REAL NOT NULL,
        longitude       REAL NOT NULL,
        hours           TEXT,
        price_level     INTEGER CHECK (price_level BETWEEN 1 AND 4),
        accessibility   TEXT,
        status          TEXT NOT NULL DEFAULT 'active',
        created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
    """,

 
    """
    CREATE TABLE IF NOT EXISTS reviews (
        id              TEXT PRIMARY KEY,
        location_id     TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        user_id         TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
        rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        body            TEXT,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE (location_id, user_id)
    );
    """,


    """
    CREATE TABLE IF NOT EXISTS events (
        id              TEXT PRIMARY KEY,
        location_id     TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        host_id         TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
        title           TEXT NOT NULL,
        description     TEXT,
        start_time      TEXT NOT NULL,
        end_time        TEXT,
        created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );
    """,
 
 
    """
    CREATE TABLE IF NOT EXISTS rsvps (
        event_id        TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id         TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
        status          TEXT NOT NULL DEFAULT 'going',
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (event_id, user_id)
    );
    """,
 

    """
    CREATE TABLE IF NOT EXISTS bookmarks (
        user_id         TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
        location_id     TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (user_id, location_id)
    );
    """
]




# =====================================
# init_db()
#
# Initializes the database using the 
# schema statements above.
# =====================================
async def init_db():
    try: 
        async with aiosqlite.connect("orbit.db") as db:
            for i in SCHEMA_STATEMENTS:
                await db.execute(i)
            await db.commit()
        print("[db.py] Schema initialized successfully\n")
        
    except aiosqlite.Error as e:
        print(f"[db.py] Database error: '{e}',\n exiting...")
        sys.exit(1)


# =====================================
# Entry Point, please don't touch this!
# =====================================
if __name__ == "__main__":
    asyncio.run(init_db())
