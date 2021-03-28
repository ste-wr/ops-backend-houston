import * as Router from '@koa/router'

// need to initialize the local auth strategy
// in controllers/auth.ts

import { authenticateUserToken } from '../controllers/auth'

const router = new Router({prefix: '/auth'})

router
    /* Handle Oauth Login */
    .post('/google', async (ctx) => {
        const data = await authenticateUserToken(ctx.request.body)
        const tokenData = JSON.parse(data)
        if(tokenData.refresh_token !== '') {
            ctx.set('Set-Cookie', [`__hstn_access_token=${tokenData.access_token}; HttpOnly`, `__hstn_refresh_token=${tokenData.refresh_token}; HttpOnly`])
        } else {
            ctx.set('Set-Cookie', [`__hstn_access_token=${tokenData.access_token}; HttpOnly`])
        }
        ctx.status = 200
        ctx.body = 'accepted'
        return ctx
    })

export default router