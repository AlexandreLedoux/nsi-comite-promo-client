import axios from "axios";
import { ApiUrl } from "./config"

const create = (credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .post(ApiUrl + '/api/like_ideas', credentials, { headers })
        .then(response => {
            return response;
        });
};

const findAll = () => {
    return axios
        .get(ApiUrl + '/api/like_ideas', {
            headers: {
                'Content-Type': 'application/ld+json',
                'Accept': 'application/ld+json'
            }
        })
        .then(response => {
            return response;
        });
};

const deleteLikeIdea = (id) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .delete(ApiUrl + '/api/like_ideas/' + id, { headers })
        .then(response => {
            return response;
        });
};

export default {
    create,
    findAll,
    deleteLikeIdea,
};
