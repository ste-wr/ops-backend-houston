import * as passport from 'koa-passport'
import * as bcrypt from 'bcrypt'
import { promisify } from 'util'
const google = require('googleapis').google
const jwt = require('jsonwebtoken')
import { v4 as uuidv4 } from 'uuid'

const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')
var oauth2 = google.oauth2({
    auth: client,
    version: 'v2'
})


const LocalStrategy = require('passport-local').Strategy

import { db } from '../models'
import { resolve } from 'path'
import { rejects } from 'assert'

const getAsync = promisify(db.get).bind(db)
const hmsetAsync = promisify(db.hmset).bind(db)
const setAsync = promisify(db.set).bind(db)

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


const authenticateUserToken = async (payload) => {
    const {tokens} = await client.getToken(payload.code)
    client.setCredentials(tokens)
    // some documentation:
    // if we assume that this is the first time we receive the authentication, we will have both the 
    // access token and the refresh token.  We then need to do two things:
    // 1.  encode the access_token into a JWT object - send both the access token and a hashed version of the refresh token to the client as separate httpOnly cookies
    // 2.  Put both tokens in the database
    const userData = await oauth2.userinfo.get()
    if(userData.data.id) {
        let user = null
        await getAsync('user').then((data) => {
            let users = []
            const uuid = uuidv4()
            if(data) {
                users = JSON.parse(data)
                user = users.find(u => u.google_id == userData.data.id)
            }
            if(!user) {
                //user not found in db = add it
                users.push({
                    id: uuid,
                    google_id: userData.data.id
                })
                db.set('user', JSON.stringify(users))
                user = {
                    id: uuid,
                    google_id: userData.data.id,
                }
            }
        }).catch((err) => {
            console.log('no user table: ',err)
        })
        return JSON.stringify({
            id: user.id,
            access_token: jwt.sign({access_token: bcrypt.hashSync(tokens.access_token, 10)}, process.env.JWT_SALT, {expiresIn: '3600s'}),
            refresh_token: tokens.refresh_token ? bcrypt.hashSync(tokens.refresh_token, 10) : ''
        })
    }
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