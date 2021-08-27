import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('database.db')

export const getVirtualUsers = async () => {
    const users = await db.all('SELECT * from user')
    console.log(users)
}