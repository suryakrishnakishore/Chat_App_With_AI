import useStore from "@/store";
import axios from "axios";


const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const api = axios.create({
    baseURL: API_URL
});

export function setAuthToken(token?: string) {
    if(token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } 
    else {
        delete api.defaults.headers.common["Authorization"];
    }
}

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       const { signOut } = useStore.getState();

//       // Clear Zustand user + token
//       signOut();

//       // Redirect to login
//       if (typeof window !== "undefined") {
//         window.location.href = "/";
//       }
//     }
//     return Promise.reject(err);
//   }
// );

export default api;