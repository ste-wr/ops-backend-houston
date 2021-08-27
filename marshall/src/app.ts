import './modules/env'
import express, { Application, Request, Response, json, urlencoded } from 'express'
import cors from 'cors'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'

import router from './router/router'

const port: number = 4000

const app: Application = express()

app.use(express.json())

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [ new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    )
}

if (!process.env.DEBUG) {
    loggerOptions.meta = false
}

app.use(cors())
app.use(expressWinston.logger(loggerOptions))
app.use(json())
app.use(urlencoded({ extended: true })) // if you want to unpack complex query strings in url parameters

app.use('/api/1', router)

app.get('/', (_req: Request, res: Response) => {
    res.status(200).send(runningMessage)
})

router.get('/_healthcheck', (_req: Request, res: Response) => {
    res.status(200).json(
        {
            "message": "System OK",
            "uptime": process.uptime()
        }
    )
})

const runningMessage: string = `Server running at http://localhost:${port}`

try {
    app.listen(port, () => {
        console.log(runningMessage)
    })
} catch (error) {
    console.error(`Error occurred: ${error.message}`)
}