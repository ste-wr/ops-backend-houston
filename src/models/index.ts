import * as sqlite from 'sqlite3'

let db = new sqlite.Database('config.db', (err) => {
    if(err) {
        console.error(err.message)
    }
    console.log('connected to database')
})

db.on('error', (err) => {
    console.log(`DB error ${err}`)
})

const init = () => {
    db.parallelize(() => {
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            google_id text, 
            CONSTRAINT google_id_unique UNIQUE (google_id)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                console.log('table USER created')
            }
        });
        db.run(`CREATE TABLE oauth_access_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, 
            access_token TEXT,
            expiry_date INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                console.log('table oauth_access_tokens created')
            }
        });
        db.run(`CREATE TABLE oauth_refresh_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            refresh_token TEXT
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                console.log('table oauth_refresh_tokens created')
            }
        });
    })
}

export {
    db,
    init
}