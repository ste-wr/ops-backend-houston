import { Router, NextFunction, Request, Response } from 'express'
import platform from './platform'
import container from './container'
import authentication from './authentication'

const router: Router = Router()

router.use((_req: Request, res: Response, next: NextFunction) => {
    res.status(200)
    console.log("Called: ", _req.path)
    next()
})

router.use('/auth', authentication)
router.use('/platform', platform)
router.use('/vu', container)

export default router