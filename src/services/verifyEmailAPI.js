import axios from "axios";
import { ApiUrl } from "./config"

const verifyEmail = (credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .post(ApiUrl + '/api/token_registers', credentials, { headers })
        .then(response => {
            return response;
        });
};

export default {
    verifyEmail
};
