import * as redis from 'redis'

const db = redis.createClient()

db.on('error', (err) => {
    console.log(`DB error ${err}`)
})

const init = () => {
    db.set('usersMockDatabase', JSON.stringify([
        {
            id: 1,
            email: 'root@houston.ops',
            password: '$2a$04$4yQfCo8kMpH24T2iQkw9p.hPjcz10m.FcWmgkOhkXNPSpbwHZ877S',
            userName: 'root'
        }
    ]), redis.print)
}

export {
    db,
    init
}