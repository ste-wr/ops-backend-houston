import * as redis from 'redis'

const initDataStore = () => {
    const db: redis.RedisClient = redis.createClient()
    db.on('error', (err) => {
        console.error(`Redis error ${err}`)
    })
    
    db.set('usersMockDatabase', JSON.stringify([
        {
            id: 1,
            email: 'test@ste-wr.io',
            password: '$2a$10$a.NULdSRpb1h74e.yHge6OEiHthJ5cVCDLMZ9XoE0.dr108xG4HHq',
            username: 'test'
        }
    ]), redis.print)
    return db
}

export default {
    initDataStore
}