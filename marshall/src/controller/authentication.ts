import axios, { AxiosRequestConfig } from 'axios'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const BASE_URL: string = 'https://teooh.evnt.build'

export const controllerLogin = async (username: string, password: string) => {
    const oauth_url: string = BASE_URL+"/oauth2/token"
    const token: string = `${process.env.OAUTH2_AUTHORIZATION_USER}:${process.env.OAUTH2_AUTHORIZATION_PASSWORD}`
    const encodedToken: string = Buffer.from(token).toString('base64')
    let config: AxiosRequestConfig = {
        method: 'POST',
        url: oauth_url,
        headers: { 'Authorization': 'Basic '+ encodedToken},
        data: {
            grant_type: 'password',
            username: username,
            password: password
        }
    }
    return new Promise<string>((resolve, reject) => {
        axios(config)
        .then(res => {
            const token: string = jwt.sign(
                {
                    user_id: res.data.user_id
                },
                res.data.access_token,
                {
                    expiresIn: res.data.expires_in,
                }
            )
            resolve(token)
        })
        .catch(err => {
            const payload = {
                code: err.response.status,
                message: err.response.data.error_description
            }
            reject(payload)
        })
    })
}

export const verifyToken = (_req: Request, _res: Response, _next: NextFunction) => {
    const token = _req.body.token || _req.query.token || _req.headers["x-access-token"]
    if(!token) {
        return _res.status(403).json({
            code: 403,
            message: "A token is required for authentication"
        })
    }
    try {
        jwt.verify(JSON.parse(token).token, 'ABC')
    } catch(err) {
        return _res.status(401).json({
            code: 401,
            message: "Invalid token"
        })
    }
    return _next()
}
