import { useState, useEffect } from 'react';
import api from '../services/api';

export const useMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all medications
  const getMedications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/medications');
      setMedications(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch medications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new medication
  const addMedication = async (medicationData) => {
    try {
      setLoading(true);
      const response = await api.post('/medications/create', medicationData);
      setMedications(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing medication
  const updateMedication = async (id, updatedData) => {
    try {
      setLoading(true);
      const response = await api.patch(`/medications/${id}`, updatedData);
      setMedications(prev =>
        prev.map(med => (med._id === id ? response.data : med))
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete medication
  const deleteMedication = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/medications/${id}`);
      setMedications(prev => prev.filter(med => med._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get medication by ID
  const getMedicationById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/medications/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get today's medications
  const getTodaysMedications = () => {
    const today = new Date().toISOString().split('T')[0];
    return medications.filter(med => {
      const startDate = new Date(med.startDate).toISOString().split('T')[0];
      const endDate = med.endDate ? new Date(med.endDate).toISOString().split('T')[0] : null;
      
      return (
        startDate <= today &&
        (!endDate || endDate >= today)
      );
    });
  };

  // Dose Log functions

const logDose = async (medicationId, scheduledTime, notes = '') => {
  try {
    setLoading(true);

    // Get today's date
    const today = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);

    // Create scheduled datetime in UTC format
    const scheduledDateTime = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      hours,
      minutes,
      0
    ));

    const response = await api.post('/logs', {
      medicationId,
    //   time: new Date().toISOString(), // current time
      scheduledTime: scheduledDateTime.toISOString(), // formatted for backend
      status: 'taken',
      notes
    });

    return response.data;
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to log dose');
    throw err;
  } finally {
    setLoading(false);
  }
};


// const logDose = async (medicationId, scheduledTime, notes = '') => {
//   try {
//     setLoading(true);
//     const response = await api.post('/logs', {
//       medicationId,
//       time: new Date().toISOString(),
//       scheduledTime, // Add scheduled time
//       status: 'taken',
//       notes // Add optional notes
//     });
//     return response.data;
//   } catch (err) {
//     setError(err.response?.data?.message || 'Failed to log dose');
//     throw err;
//   } finally {
//     setLoading(false);
//   }
// };

  const getDoseLogs = async (medicationId) => {
    try {
      setLoading(true);
      const response = await api.get('/logs/getLogs', {
        params: { medicationId }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dose logs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDoseLog = async (logId, updatedData) => {
    try {
      setLoading(true);
      const response = await api.patch(`/logs/${logId}`, updatedData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update dose log');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize with medications
  useEffect(() => {
    getMedications();
  }, []);

  return {
    medications,
    loading,
    error,
    getMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    getMedicationById,
    getTodaysMedications,
    logDose,
    getDoseLogs,
    updateDoseLog
  };
};