import axios from "axios";
import { ApiUrl } from "./config"

const create = (credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .post(ApiUrl + '/api/users', credentials, { headers })
        .then(response => {
            return response;
        });
};

const changePassword = (id, credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .put(ApiUrl + '/api/users/' + id + '/password', credentials, { headers })
        .then(response => {
            return response;
        });
};

function findAll() {
    return axios
        .get(ApiUrl + '/api/users', {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept': 'application/ld+json'
            }
        })
        .then(response => {
            return response;
        });
}

const deleteUser = (id) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .delete(ApiUrl + '/api/users/' + id, { headers })
        .then(response => {
            return response;
        });
};

export default {
    create,
    changePassword,
    findAll,
    deleteUser,
};