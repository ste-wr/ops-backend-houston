require('dotenv').config({path: require('find-config')('.env')})

import * as Koa from 'koa'
import * as session from 'koa-session'
import * as redisStore from 'koa-redis'
import * as passport from 'koa-passport'

import * as db from './models'
import authRoutes from './routes/auth'

const app = new Koa()

const init = async () => {
    db.init()
    app.use(
        session(
            {
                store: redisStore()
            },
            app
        )
    )
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(authRoutes.routes())
    app.use(authRoutes.allowedMethods())
    if(module.children) {
        app.listen(process.env.PORT || 3000)
        console.log('App listening on port 3000')
    }
}

process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
})

init()