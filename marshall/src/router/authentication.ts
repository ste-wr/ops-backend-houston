import { Request, Router, Response } from 'express'
import { controllerLogin } from '../controller/authentication'

const router: Router = Router()

router.post('/login', async (_req: Request, _res: Response) => {
    await controllerLogin(_req.body.username, _req.body.password)
    .then(data => {
        _res.status(200).json({
            token: data
        })
    })
    .catch(err => {
        _res.status(401).json(err)
    })
})

export default router