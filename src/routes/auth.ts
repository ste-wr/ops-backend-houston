import * as Router from '@koa/router'
import * as passport from 'koa-passport'

// need to initialize the local auth strategy
// in controllers/auth.ts

import { authenticateUserToken } from '../controllers/auth'

const router = new Router({prefix: '/auth'})

router
    .post('/login', async (ctx, next) => {
        return passport.authenticate('local', (err, user, info, status) => {
            if(!user) {
                if(err) {
                    ctx.throw(500, err)
                } else {
                    if(status) {
                        ctx.throw(status, info)
                    } else {
                        ctx.throw(400, info)
                    }
                }
            } else {
                ctx.body = user
                return ctx.login(user)
            }
        })(ctx, next)
    })
    //.get('/users/profile', auth.getLoggedUser)
    .get('/logout', (ctx) => {
        ctx.logout();
        ctx.body = {};
    })
    /* Handle Oauth Login */
    .post('/google', async (ctx, next) => {
        const resp = await authenticateUserToken(ctx.request.body)
        ctx.body = resp
        return ctx
    })
    .get('/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/failed'
    }))

export default router