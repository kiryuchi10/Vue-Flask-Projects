import mysql.connector
from mysql.connector import Error

def test_connection():
    try:
        # Connect to the database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='1234',
            database='aichatbotproject'
        )

        if connection.is_connected():
            print('Successfully connected to the database.')

            # Create a cursor object
            cursor = connection.cursor()

            # Execute a simple query to test the connection
            cursor.execute("SELECT VERSION()")
            db_version = cursor.fetchone()
            print(f"Database version: {db_version[0]}")

    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    
    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()
            print('Database connection closed.')

if __name__ == '__main__':
    test_connection()
