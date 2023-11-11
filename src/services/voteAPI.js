import axios from "axios";
import { ApiUrl } from "./config"

const create = (credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .post(ApiUrl + '/api/votes', credentials, { headers })
        .then(response => {
            return response;
        });
};

const findAll = () => {
    return axios
        .get(ApiUrl + '/api/votes', {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept': 'application/ld+json'
            }
        })
        .then(response => {
            return response;
        });
};

export default {
    create,
    findAll
};
