import * as passport from 'koa-passport'
import * as bcrypt from 'bcrypt'
import { promisify } from 'util'
const google = require('googleapis').google
const jwt = require('jsonwebtoken')

const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')
var oauth2 = google.oauth2({
    auth: client,
    version: 'v2'
})


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

const hashAndCreateJWT = (access_token) => {
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            console.log(err)
        } else {
            bcrypt.hash(access_token, salt, (err, hash) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log(hash)
                    return jwt.sign({access_token: hash}, process.env.JWT_SALT, {expiresIn: '3600s'})
                }
            })
        }
    })
}


const authenticateUserToken = async (payload) => {
    const {tokens} = await client.getToken(payload.code)
    client.setCredentials(tokens)
    const jwtObject = hashAndCreateJWT(tokens.access_token)
    if(tokens.refresh_token) {
        const refresh_token = tokens.refresh_token
    } else {
        console.log("no refresh token in response object")
    }
    // some documentation:
    // if we assume that this is the first time we receive the authentication, we will have both the 
    // access token and the refresh token.  We then need to do two things:
    // 1.  encode the access_token into a JWT object - send both the access token and a hashed version of the refresh token to the client as separate httpOnly cookies
    // 2.  Put both tokens in the database
    const usr_info = await oauth2.userinfo.get(
        (err, res) => {
            if(err) {
                console.log(err)
            }
        }
    )
    return usr_info
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