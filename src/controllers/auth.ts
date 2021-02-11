import * as passport from 'koa-passport'
import * as bcrypt from 'bcrypt'
import { promisify } from 'util'


const LocalStrategy = require('passport-local').Strategy

import { db } from '../models'

const getAsync = promisify(db.get).bind(db)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        let user = null
        await getAsync('usersMockDatabase').then((users) => {
            user = JSON.parse(users).find(currUser => currUser.id === id)
        })
        if(user) {
            done(null, user)
        } else {
            done(null, false)
        }
    } catch (err) {
        done(err)
    }
})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            let user = null
            await getAsync('usersMockDatabase').then((users) => {
                const currUsers = JSON.parse(users)
                user = currUsers.find(currUser => currUser.email === email)
            })
            if(!user) {
                done({type: 'email', message: 'No such user found'}, false)
                return
            }
            if(bcrypt.compareSync(password, user.password)) {
                done(null, { id: user.id, email: user.email, userName: user.userName})
            } else {
                done({type: 'password', message: 'Passwords did not match'}, false)
            }
        }
    )
)