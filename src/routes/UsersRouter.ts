import { Router } from 'express'

const auth = require('../controllers/auth')

const router = Router()

router.route('/profile').get(auth.getLoggedUser)

export default router