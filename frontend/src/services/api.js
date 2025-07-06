import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const createLog = (log) => API.post('/logs', log);
export const getLogs = (params) => API.get('/logs', { params });
