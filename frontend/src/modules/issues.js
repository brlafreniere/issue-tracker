import axiosInstance from "./axios";

export default class Issues {
    static getAll() {
        return new Promise( (resolve, reject) => {
            axiosInstance.get("/issues")
                .then(response => { resolve(response.data) })
                .catch(error => { reject(error) })
        })
    }

    static create(payload) {
        return new Promise( (resolve, reject) => {
            axiosInstance.post("/issues", payload)
                .then(response => { resolve(response) })
                .catch(error => { reject(error) })
        })
    }

    static delete(issue_id) {
        return new Promise( (resolve, reject) => {
            axiosInstance.delete(`/issues/${issue_id}`)
                .then(response => { resolve(response) })
                .catch(error => { reject(error) })
        })
    }
}