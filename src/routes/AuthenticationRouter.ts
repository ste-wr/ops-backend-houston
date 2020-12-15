import { Router } from 'express'
import * as passport from 'passport'
const router = Router()

router.get('/auth/error', (req, res) => {
    res.status(401).send('Error')
})

router.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}))
.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/error'
}))

export default router