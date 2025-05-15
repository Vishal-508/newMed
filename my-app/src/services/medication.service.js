import api from './api';

export const getMedications = () => api.get('/medications');
export const createMedication = (data) => api.post('/medications', data);
export const updateMedication = (id, data) => api.patch(`/medications/${id}`, data);
export const deleteMedication = (id) => api.delete(`/medications/${id}`);
export const logDose = (data) => api.post('/logs', data);