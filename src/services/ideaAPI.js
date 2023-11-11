import axios from "axios";
import { ApiUrl } from "./config"

const findAll = () => {
    return axios
        .get(ApiUrl + '/api/ideas', {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept': 'application/ld+json'
            }
        })
        .then(response => {
            return response;
        });
};

const findOneById = (id) => {
    return axios
        .get(ApiUrl + '/api/ideas/' + id, {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept': 'application/ld+json'
            }
        })
        .then(response => {
            return response;
        });
};

const create = (credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .post(ApiUrl + '/api/ideas', credentials, { headers })
        .then(response => {
            return response;
        });
};

const deleteIdea = (id) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .delete(ApiUrl + '/api/ideas/' + id, { headers })
        .then(response => {
            return response;
        });
};

export default {
    findAll,
    findOneById,
    create,
    deleteIdea,
};
