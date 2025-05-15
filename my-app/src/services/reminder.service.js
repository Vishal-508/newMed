import api from './api';

export const getReminderSettings = () => api.get('/reminders/settings');
export const updateReminderSettings = (data) => api.patch('/reminders/settings', data);
export const setupGoogleCalendar = (code) => api.post('/reminders/calendar', { code });