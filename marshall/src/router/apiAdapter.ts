import axios from 'axios'

export default (baseURL: string) => {
    return axios.create({
        baseURL: baseURL
    })
}