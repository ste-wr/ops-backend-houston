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
        await authenticateUserToken(ctx.request.body).then((res) => {
            const tokenData = JSON.parse(res)
            if(tokenData.refresh_token !== '') {
                ctx.set('Set-Cookie', [`__hstn_access_token=${tokenData.access_token}; HttpOnly`, `__hstn_refresh_token=${tokenData.refresh_token}; HttpOnly`, `__hstn_id=${tokenData.id}`])
            } else {
                ctx.set('Set-Cookie', [`__hstn_access_token=${tokenData.access_token}; HttpOnly`, `__hstn_id=${tokenData.id}`])
            }
            ctx.status = 200
            ctx.body = 'accepted'
            return ctx
        })
    })
    .get('/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/failed'
    }))

export default router