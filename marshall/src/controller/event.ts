import axios, { AxiosResponse } from 'axios'

const BASE_URL: string = 'https://teooh.evnt.build/api/1'

export interface ticketType {
    ticket_type_id: number,
    space_template_ticket_type_id: string,
    auto_issue_tickets: string,
    ticket_cost_type: string,
    ticket_type_name: string,
    ticket_type_description: string,
    is_speaker: boolean,
    is_owner: boolean,
    total_tickets_remaining: number,
    tickets_remaining: number,
    tickets_issued: number,
    tickets_used: string,
    minimum_issue_quantity: number,
    maximum_issue_quantity: number,
    ticket_type_sort_order: number,
    visibility: string,
    is_event_auto_issue_ticket: boolean,
    ticket_type_costs: Array<number>,
    event_roles: Array<string>,
    has_owner_role: boolean
}

export const getTicketTypesForEvent = (access_token: string, event_id: number) => {
    return new Promise<Array<ticketType>>((resolve, reject) => {
        axios.get(BASE_URL+'/ticket/type/list', {
            params: {
                access_token: access_token,
                event_id: event_id
            }
        }).then((res: AxiosResponse) => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}