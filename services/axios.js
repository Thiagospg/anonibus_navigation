import axios from 'axios';

const api = axios.create({
  baseURL: 'https://us-central1-anonibus-thiago.cloudfunctions.net',
});

export default api;
