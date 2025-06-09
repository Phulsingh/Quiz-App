import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:4000/api"
});

export default API;

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common["Authorization"];
    }
};

// Other API calls
export const createQuizApi = (quizData) => API.post('/quiz', quizData);