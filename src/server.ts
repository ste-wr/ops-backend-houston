require('dotenv').config({path: require('find-config')('.env')})

import * as Koa from 'koa'
import * as session from 'koa-session'
import * as bodyParser from 'koa-bodyparser'
import * as redisStore from 'koa-redis'
import * as cors from '@koa/cors'
import * as passport from 'koa-passport'

import * as db from './models'
import authRoutes from './routes/auth'
import systemRoutes from './routes/system'

const app = new Koa()

const init = async () => {
    db.init()
    app.keys = [process.env.KOA_SESSION_SECRET];
    app.use(
        session(
            {
                store: redisStore()
            },
            app
        )
    )
    const corsOptions = {
        credentials: true,
        origin: "http://localhost:3000"
    }
    app.use(cors(corsOptions))
    app.use(async (ctx, next) => {
        try {
          await next();
        } catch (error) {
          ctx.status = error.status || 500;
          ctx.type = 'json';
          ctx.body = {
            message: error.message,
            type: error.type,
          };
          ctx.app.emit('error', error, ctx);
        }
    });
    app.use(bodyParser())
    require('./controllers/auth')
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(authRoutes.routes())
    app.use(authRoutes.allowedMethods())
    app.use(systemRoutes.routes())
    app.use(systemRoutes.allowedMethods())
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