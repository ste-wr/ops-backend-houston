import * as passport from 'passport'

const GithubStrategy = require('passport-github2').Strategy

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GithubStrategy(
    {
        clientID: '6a1aa44e973e9ac0c1ca',
        clientSecret: '13897cd806820028a5d54610454674a553eb28c9',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
            console.log(profile)
            return done(null, profile)
        })
    }
))