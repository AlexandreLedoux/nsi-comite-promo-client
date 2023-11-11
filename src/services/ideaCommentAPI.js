import axios from "axios";
import { ApiUrl } from "./config"

const create = (credentials) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .post(ApiUrl + '/api/idea_comments', credentials, { headers })
        .then(response => {
            return response;
        });
};

const deleteIdeaComment = (id) => {
    const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
    };

    return axios
        .delete(ApiUrl + '/api/idea_comments/' + id, { headers })
        .then(response => {
            return response;
        });
};

export default {
    create,
    deleteIdeaComment,
};
