import * as passport from 'passport'
import * as bcrypt from 'bcrypt'

const GithubStrategy = require('passport-github2').Strategy
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(async (id, done) => {
    try {
        let user = null
        await dataStoreGetAsync('usersMockDatabase').then((results) => {
            user = JSON.parse(results).find(currentUser => currentUser.id === id)
        })
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    } catch (err) {
        done(err, null)
    }
})

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done) => {
        let user = null
        await dataStoreGetAsync('usersMockDatabase').then((results) => {
            const currentUsers = JSON.parse(results)
            user = currentUsers.find(currentUser => currentUser.email === email)
        })
        if(!user) {
            done({type: 'email', message: 'No such user found'}, false)
            return
        }
        if(bcrypt.compareSync(password, user.password)) {
            done(null, { id: user.id, email: user.email, username: user.username})
        } else {
            done({type: 'password', message: 'Password did not match'}, false)
        }
    }
))

passport.use(new GithubStrategy(
    {
        clientID: '6a1aa44e973e9ac0c1ca',
        clientSecret: '13897cd806820028a5d54610454674a553eb28c9',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            // to complete - lookup user in data store
            console.log(profile)
            return done(null, profile)
        })
    }
))

exports.getLoggedUser = async (req, res, next) => {
    if(req.user) {
        console.log("OK")
        next()
    } else {
        res.redirect('/auth/error')
    }
}