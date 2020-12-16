import * as express from 'express'
import * as session from 'express-session'
import * as passport from 'passport'

import DataStore from './controllers/dataStore'
import DefaultRouter from './routes/DefaultRouter'
import IndexRouter from './routes/IndexRouter'
import AuthenticationRouter from './routes/AuthenticationRouter'

type sessionData = {
    secret: string,
    cookie: {
        secure: boolean
    }
}


const init = async () => {
    const app = express()
    const Settings = require('./settings')
    const db = DataStore.initDataStore()
    require('./controllers/auth')
    let sess: sessionData = {
        secret: 'keyboard cat',
        cookie: {
            secure: false
        }
    }

    if(Settings.env === "production") {
        app.set('trust proxy', 1) //trust first proxy
        sess.cookie.secure = true
    }

    app.use(session(sess))

    app.use(passport.initialize())
    app.use(passport.session())

    // define all routes
    app.use("/", IndexRouter)
    app.use("/security", AuthenticationRouter)

    //last route
    app.use("*", DefaultRouter)

    app.listen(Settings.port, () => {
        console.log(`Listening on port ${Settings.port}`)
    })
}

process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
})

init()