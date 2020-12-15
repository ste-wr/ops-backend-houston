import { Router } from 'express'

const router = Router()

router.route('*').get((req, res) => {
    res.status(200).send({"statusMessage": "OK", "requestQuery": req.query})
})

router.route('*').post((req, res) => {
    res.status(200).send({"statusMessage": "OK", "requestParams": req.params})
})

export default router