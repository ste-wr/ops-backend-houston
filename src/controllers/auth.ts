import * as passport from 'koa-passport'
import * as bcrypt from 'bcrypt'
const google = require('googleapis').google
const jwt = require('jsonwebtoken')
import { db } from '../models'

const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage')
const oauth2 = google.oauth2({
    auth: client,
    version: 'v2'
})

type hstnUser = {
    id: number,
    google_id: string
}

passport.serializeUser((user, done) => {
    done(null, user.id)
})

const getOrInsertUser = (id: string) => {
    return new Promise((resolve, reject) => {
        let user: hstnUser = null
        db.serialize(() => {
            db.get("SELECT * FROM user where google_id = ?", id, (err, row) => {
                if (err) {
                    // database error
                    console.error(err)
                    reject(err)
                } else {
                    if (!row) {
                        db.run(`INSERT INTO user(google_id) VALUES(?)`, [id], function(this: any, err: any) {
                            if(err) {
                                console.error(err)
                            }
                            user = {
                                id: this.lastID,
                                google_id: id,
                            }
                            resolve(user)
                        })
                    } else {
                        user = {
                            id: row.id,
                            google_id: id,
                        }
                        resolve(user)
                    }
                }
            })
        })
    })
}

const insertUserAccessToken = (user_id, token, expiry) => {
    const epoch_expiry = expiry / 1000
    db.run(`INSERT INTO oauth_access_tokens(user_id, access_token, expiry_date) VALUES(?,?,?)`, [user_id, token, epoch_expiry], function(this: any, err: any) {
        if(err) {
            console.error(err)
        }
        console.log(`Inserted access token with lastID ${this.lastID}`)
    })
}

const insertUserRefreshToken = (user_id, token) => {
    db.run(`INSERT INTO oauth_refresh_tokens(user_id, refresh_token) VALUES(?,?)`, [user_id, token], function(this: any, err: any) {
        if(err) {
            console.error(err)
        }
        console.log(`Inserted refresh token with lastID ${this.lastID}`)
    })
}

const authenticateUserToken = async (payload) => {
    let data = null
    const {tokens} = await client.getToken(payload.code)
    client.setCredentials(tokens)
    // some documentation:
    // if we assume that this is the first time we receive the authentication, we will have both the 
    // access token and the refresh token.  We then need to do two things:
    // 1.  encode the access_token into a JWT object - send both the access token and a hashed version of the refresh token to the client as separate httpOnly cookies
    // 2.  Put both tokens in the database
    const userData = await oauth2.userinfo.get()
    if(userData.data.id) {
        await getOrInsertUser(userData.data.id).then((user: any) => {
            const hashedAccessToken = bcrypt.hashSync(tokens.access_token, 10)
            insertUserAccessToken(user.id, hashedAccessToken, tokens.expiry_date)
            let hashedRefreshToken = ""
            if(tokens.refresh_token) {
                hashedRefreshToken = bcrypt.hashSync(tokens.refresh_token, 10)
                insertUserRefreshToken(user.id, hashedRefreshToken)
            }
            data = JSON.stringify({
                access_token: jwt.sign({access_token: hashedAccessToken}, process.env.JWT_SALT, {expiresIn: '3600s'}),
                refresh_token: hashedRefreshToken
            })
        })
    } else {
        return null
    }
    return data
}

export {
    authenticateUserToken
}