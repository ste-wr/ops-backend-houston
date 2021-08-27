import qs from 'qs'
import { Request, Router, Response } from 'express'
import apiAdapter from './apiAdapter'
import { getTicketTypesForEvent, ticketType } from '../controller/event'
import { controllerLogin, verifyToken } from '../controller/authentication'
import fs from 'fs'
import { resolve } from 'path'

const router: Router = Router()

const BASE_URL: string = 'https://teooh.evnt.build/api/1'
const api = apiAdapter(BASE_URL)

router.get('/ticket/issue', async (_req: Request, res: Response) => {
  const desiredTicketTypeName: string = 'Attendee'
  const eventId: number = 67215
  const access_token: string = "2aec31aeb3072d33820872530e690ff1b4219e1c"
  let authData: string
  authData = JSON.parse(fs.readFileSync(resolve(__dirname, '../../.config')).toString())
  if(!JSON.parse(authData).access_token)
  {
    authData = await controllerLogin('abc', 'abc')
    fs.writeFileSync(resolve(__dirname, '../../.config'), JSON.stringify(authData), 'utf-8')
  }
  getTicketTypesForEvent(JSON.parse(authData).access_token, eventId)
  .then((ticketTypes: Array<ticketType>) => {
    let t = ticketTypes.find(ticket => ticket.ticket_type_name === desiredTicketTypeName)
    if(t) {
      api({
        method: 'POST',
        url: _req.path,
        data: qs.stringify({
          access_token: access_token,
          ticket_type_id: t.ticket_type_id.toString(),
          user_id: '51',
          email_address_permission_agreed: 'FALSE'
        }),
        headers: { "content-type": "application/x-www-form-urlencoded;charset=utf-8"}
      })
      .then(resp => {
        res.status(200).send(resp.data)
      })
      .catch(err => {
        console.error(err.response)
        res.status(err.response.status).send(err.response.data)
      })
    } else {
      return
    }
  })
  .catch(err => {
    console.error(err)
  })
})

router.get('/base', verifyToken, async (_req: Request, _res: Response) => {
  _res.status(200).send('ok')
})



export default router