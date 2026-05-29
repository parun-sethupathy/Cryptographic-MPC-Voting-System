from backend.mpc_database import get_db

def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS voters (
        voter_id TEXT PRIMARY KEY,
        name TEXT,
        password TEXT,
        has_voted INTEGER
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS votes (
        voter_id TEXT,
        vote INTEGER
    )
    """)

    conn.commit()
    conn.close()