import * as Router from '@koa/router'
import * as passport from 'koa-passport'

// need to initialize the local auth strategy
// in controllers/auth.ts

const router = new Router({prefix: '/auth'})

router
    .get('/login', ctx => passport.authenticate('local', (err, user) => {
        if(!user) {
            ctx.throw(401, err)
        } else {
            ctx.body = user
            return ctx.login(user)
        }
    })(ctx))

export default router