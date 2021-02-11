import * as Router from '@koa/router'
import * as passport from 'koa-passport'

// need to initialize the local auth strategy
// in controllers/auth.ts

//import * as auth from '../controllers/auth'

const router = new Router({prefix: '/auth'})

router
    .post('/login', async (ctx, next) => {
        return passport.authenticate('local', (err, user, info, status) => {
            console.log(err)
            console.log(user)
            console.log(info)
            console.log(status)
            if(!user) {
                ctx.throw(401, info)
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
    //.get('/google', passport.authenticate('google'))
    //.get('/google/callback', passport.authenticate('google', {
    //    successRedirect: '/google/success/',
    //    failureRedirect: '/'
    //}))

export default router