import axios from 'axios'

const apiClient = axios.create({
    baseURL:'http://127.0.0.1:8000/api',
    headers:{
        'content-type':'application/json',
    }
})

export default apiClient