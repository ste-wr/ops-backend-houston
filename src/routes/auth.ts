import * as Router from '@koa/router'

// need to initialize the local auth strategy
// in controllers/auth.ts

import { authenticateUserToken, generateGoogleAuthURL } from '../controllers/auth'

const router = new Router({prefix: '/auth'})

router
    .get('/login', async (ctx) => {
        const url = await generateGoogleAuthURL(ctx)
        ctx.status = 200
        ctx.body = url
        return ctx
    })
    .get('/google/callback', async(ctx) => {
        const data = await authenticateUserToken(ctx)
        const tokenData = JSON.parse(data)
        if(tokenData.refresh_token !== '') {
            ctx.cookies.set('__hstn_access_token', tokenData.access_token, {
                httpOnly: false,
                path: '/',
                secure: false
            })
            ctx.cookies.set('__hstn_refresh_token', tokenData.refresh_token, {
                httpOnly: true,
                path: '/',
                secure: false
            })
        } else {
            ctx.cookies.set('__hstn_access_token', tokenData.access_token, {
                httpOnly: false,
                path: '/',
                secure: false
            })
        }
        ctx.redirect(ctx.cookies.get('__hstn_auth_origin'))
        return ctx
    })

export default router