import pymongo
import psycopg2

# Connect to MongoDB
mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["try"]
mongo_collection = mongo_db["users"]

# Connect to PostgreSQL
pg_conn = psycopg2.connect(
    dbname="test",
    user="bhavya",
    password="root",
    host="localhost",
    port="5432"
)
pg_cursor = pg_conn.cursor()

# Create a users table in PostgreSQL
pg_cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        mongo_id VARCHAR(24),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
    );
""")
pg_conn.commit()

# Insert data from MongoDB to PostgreSQL
for doc in mongo_collection.find():
    pg_cursor.execute("""
        INSERT INTO users (mongo_id, first_name, last_name, email, password)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING;
    """, (
        str(doc["_id"]),
        doc.get("firstName"),
        doc.get("lastName"),
        doc.get("email"),
        doc.get("password")
    ))

pg_conn.commit()

# Close connections
pg_cursor.close()
pg_conn.close()
mongo_client.close()

print("Data transfer complete!")
