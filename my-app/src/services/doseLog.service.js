import api from './api';

export const logDose = (data) => api.post('/logs', data);
export const getLogs = (params) => api.get('/logs/getLogs', { params });
export const updateLog = (id, data) => api.patch(`/logs/${id}`, data);

export default {
  logDose,
  getLogs,
  updateLog
};