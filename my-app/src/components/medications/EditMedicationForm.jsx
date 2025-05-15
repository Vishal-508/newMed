import { useState } from 'react';
import styled from 'styled-components';
import { useMedications } from '../../hooks/useMedications';
import { Button, Input, Select } from '../ui';

const EditMedicationForm = ({ medication, onCancel, onSuccess }) => {
  const { updateMedication } = useMedications();
  const [formData, setFormData] = useState({
    name: medication.name,
    dose: medication.dose,
    frequency: medication.frequency,
    schedule: [...medication.schedule],
    startDate: medication.startDate.split('T')[0],
    endDate: medication.endDate ? medication.endDate.split('T')[0] : '',
    category: medication.category || 'general',
    notes: medication.notes || ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = value;
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await updateMedication(medication._id, {
        ...formData,
        frequency: formData.schedule.length
      });
      onSuccess();
    } catch (err) {
      setError('Failed to update medication');
      console.error(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormGroup>
        <Label>Medication Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Dose</Label>
        <Input
          name="dose"
          value={formData.dose}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Category</Label>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="general">General</option>
          <option value="heart">Heart</option>
          <option value="diabetes">Diabetes</option>
          <option value="pain">Pain Relief</option>
          <option value="other">Other</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Start Date</Label>
        <Input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>End Date (optional)</Label>
        <Input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </FormGroup>

      <TimeSlotsContainer>
        <Label>Dosage Times</Label>
        {formData.schedule.map((time, index) => (
          <TimeSlot key={index}>
            <Input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(index, e.target.value)}
              required
            />
          </TimeSlot>
        ))}
      </TimeSlotsContainer>

      <FormGroup>
        <Label>Notes (optional)</Label>
        <Input
          as="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    </Form>
  );
};

// Styled components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const TimeSlotsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TimeSlot = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export default EditMedicationForm;