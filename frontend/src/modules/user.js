import axiosInstance from "./axios";

export default class Users {
    static create(payload) {
        return new Promise( (resolve, reject) => {
            axiosInstance.post("/users", payload)
                .then(response => { resolve(response.data) })
                .catch(error => { reject(error) })
        })
    }
}