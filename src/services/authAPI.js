import axios from "axios";
import jwtDecode from "jwt-decode";
import { ApiUrl } from "./config"

const logout = () => {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
};

const lock = () => {
  const dataToStore = { email: getUser().username, name: getUser().firstName };
  window.localStorage.setItem("authLockEmail", JSON.stringify(dataToStore));
  logout();
};

const deleteLock = () => {
  window.localStorage.removeItem("authLockEmail");
};

const hasLockEmail = () => {
  const email = window.localStorage.getItem("authLockEmail");
  if (email) {
    return true;
  } else {
    return false;
  }
};

const authenticate = (credentials) => {
  const headers = {
    'Content-Type': 'application/ld+json',
    'Accept': 'application/ld+json'
  };

  return axios
    .post(ApiUrl + '/auth', credentials, { headers })
    .then(response => {
      window.localStorage.setItem("authToken", response.data.token);
      window.localStorage.removeItem("authLockEmail");
      setAxiosToken(response.data.token);
      return response;
    });
};

const authWithToken = (token) => {
  window.localStorage.setItem("authToken", token);
  setAxiosToken(token);
};

const setAxiosToken = (token) => {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
};

const setup = () => {
  // 1. Voir si on a un token ?
  const token = window.localStorage.getItem("authToken");
  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
      // console.log('Toutes les prochaines requetes utilisent Bearer Token.');
    }
  }
};

const isAuthenticated = () => {
  // 1. Voir si on a un token ?
  const token = window.localStorage.getItem("authToken");
  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    window.localStorage.removeItem("authToken");
    return false;
  }
  return false;
};

const getUser = () => {
  const token = window.localStorage.getItem("authToken");
  return jwtDecode(token);
};

const hasRole = (role) => {
  const user = getUser();
  return user.roles.includes(role);
};

export default {
  logout,
  authenticate,
  authWithToken,
  setAxiosToken,
  setup,
  isAuthenticated,
  getUser,
  hasRole,
  lock,
  hasLockEmail,
  deleteLock,
};