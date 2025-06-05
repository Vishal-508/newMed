const Medication = require('../models/Medication');
const DoseLog = require('../models/DoseLog');

/**
 * Service for medication-related operations
 */
class MedicationService {
  /**
   * Get all medications for a user
   * @param {String} userId - User ID
   * @returns {Promise<Array>} - List of medications
   */
  static async getUserMedications(userId) {
    try {
      const medications = await Medication.find({ userId }).sort({ createdAt: -1 });
      return medications;
    } catch (error) {
      console.error('Error fetching user medications:', error);
      throw new Error('Failed to retrieve medications. Please try again.');
    }
  }
  
  /**
   * Create a new medication
   * @param {String} userId - User ID
   * @param {Object} medicationData - Medication data
   * @returns {Promise<Object>} - Created medication
   */
  static async createMedication(userId, medicationData,_id) {
    try {
      const medication = new Medication({
        userId,
        _id,
        ...medicationData
      });
      
      await medication.save();
      
      // TODO: Schedule future dose logs based on frequency and schedule
      console.log('New medication created:', medication._id);
      
      return medication;
    } catch (error) {
      console.error('Error creating medication:', error);
      if (error.name === 'ValidationError') {
        throw new Error('Invalid medication data. Please check all required fields.');
      }
      throw new Error('Failed to create medication. Please try again.');
    }
  }
  
  /**
   * Get a single medication
   * @param {String} userId - User ID
   * @param {String} medicationId - Medication ID
   * @returns {Promise<Object>} - Medication data
   */
  static async getMedication(userId, medicationId) {
    try {
        console.log("params.id",medicationId,"userid",userId)
      const medication = await Medication.findOne({
        _id: medicationId,
        userId
      });
      
      if (!medication) {
        throw new Error('Medication not found');
      }
      
      return medication;
    } catch (error) {
      console.error('Error fetching medication:', error);
      if (error.kind === 'ObjectId') {
        throw new Error('Invalid medication ID format');
      }
      throw new Error('Failed to retrieve medication. Please try again.');
    }
  }
  
  /**
   * Update a medication
   * @param {String} userId - User ID
   * @param {String} medicationId - Medication ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated medication
   */
  static async updateMedication(userId, medicationId, updates) {
    try {
      const medication = await Medication.findOneAndUpdate(
        { _id: medicationId, userId },
        updates,
        { new: true, runValidators: true }
      );
      
      if (!medication) {
        throw new Error('Medication not found');
      }
      
      console.log('Medication updated:', medicationId);
      return medication;
    } catch (error) {
      console.error('Error updating medication:', error);
      if (error.name === 'ValidationError') {
        throw new Error('Invalid update data. Please check the fields.');
      }
      throw new Error('Failed to update medication. Please try again.');
    }
  }
  
  /**
   * Delete a medication and its associated dose logs
   * @param {String} userId - User ID
   * @param {String} medicationId - Medication ID
   * @returns {Promise<Object>} - Deletion result
   */
  static async deleteMedication(userId, medicationId) {
    try {
      // Delete medication
      const medication = await Medication.findOneAndDelete({
        _id: medicationId,
        userId
      });
      
      if (!medication) {
        throw new Error('Medication not found');
      }
      
      // Delete associated dose logs
      await DoseLog.deleteMany({
        medicationId,
        userId
      });
      
      console.log('Medication deleted:', medicationId);
      return { 
        success: true,
        message: 'Medication deleted successfully' 
      };
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw new Error('Failed to delete medication. Please try again.');
    }
  }
}

module.exports = MedicationService;