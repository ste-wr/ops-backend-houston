import * as Router from '@koa/router'

const router = new Router({prefix: '/system'})

router
    .get('/dashboard', async (ctx) => {
        ctx.status = 200
        ctx.body = 'this is fine'
        return ctx
    })

export default router