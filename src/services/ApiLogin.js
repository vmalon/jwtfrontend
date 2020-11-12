import axios from 'axios';

const apiLogin = axios.create({
    baseURL: 'http://localhost:54522/api/'
});

export default apiLogin;