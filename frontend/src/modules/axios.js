import Axios from "axios"
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const authToken = cookies.get('auth-token');

const axiosInstance = Axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Authorization": authToken
    }
})

export default axiosInstance;