import * as passport from 'koa-passport'
import * as bcrypt from 'bcrypt'
import { promisify } from 'util'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')


const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

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
        async (username, password, done) => {
            let user = null
            await getAsync('usersMockDatabase').then((users) => {
                const currUsers = JSON.parse(users)
                user = currUsers.find(currUser => currUser.email === username)
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

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        proxy:true
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile)
        return cb(null, profile)
    })
)

const authenticateUserToken = async (payload) => {
    await client.getToken(payload.code)
    .then(data => {
        //we have access and ID token
    })
    .catch(err => {
        console.log(err)
    })
}

const getLoggedUser = async (ctx) => {
    if(ctx.isAuthenticated()) {
        const reqUserId = ctx.req.user.id
        let user = null
        await getAsync('usersMockDatabase').then((users) => {
            user = JSON.parse(users).find(currUser => currUser.id === reqUserId)
        })
        if(user) {
            delete user.password
            ctx.response.body = user
        } else {
            const statusCode = 500
            ctx.throw(statusCode, "User doesn't exist")
        }
    } else {
        ctx.redirect('/')
    }
}

export {
    getLoggedUser,
    authenticateUserToken
}