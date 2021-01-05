import { Router } from 'express'
import * as passport from 'passport'
const router = Router()


router.route('/error').get((req, res) => {
    res.status(401).send('Error')
})

router.route('/logout').get((ctx) => {
    ctx.logout()
    ctx.body = {}
})

router.route('/github').get(passport.authenticate('github', {scope: ['user:email']}))

router.route('/github/callback').get(passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/error'
}))

export default router