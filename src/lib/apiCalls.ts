import axios from "axios";


const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export function setAuthToken(token?: string) {
    if(token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } 
    else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;