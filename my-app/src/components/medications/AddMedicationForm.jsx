import { useState } from 'react';
import styled from 'styled-components';
import { useMedications } from '../../hooks/useMedications';
import { Button, Input, Select as UISelect } from '../../components/ui/index';

const AddMedicationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    frequency: 1,
    schedule: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    category: 'general'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addMedication } = useMedications();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = value;
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addTimeSlot = () => {
    if (formData.schedule.length < 10) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, '08:00']
      }));
    }
  };

  const removeTimeSlot = (index) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, schedule: newSchedule }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await addMedication({
        ...formData,
        frequency: formData.schedule.length
      });
      onSuccess?.();
    } catch (err) {
      setError('Failed to add medication');
    } finally {
      setLoading(false);
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
          placeholder="e.g., Paracetamol"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Dose</Label>
        <Input
          name="dose"
          value={formData.dose}
          onChange={handleChange}
          placeholder="e.g., 500mg"
          required
        />
      </FormGroup>

<FormGroup>
        <Label>Category</Label>
        <UISelect // Changed from Select to UISelect
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="general">General</option>
          <option value="heart">Heart</option>
          <option value="diabetes">Diabetes</option>
          <option value="pain">Pain Relief</option>
          <option value="other">Other</option>
        </UISelect> {/* Changed from Select to UISelect */}
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
            {formData.schedule.length > 1 && (
              <RemoveButton type="button" onClick={() => removeTimeSlot(index)}>
                ×
              </RemoveButton>
            )}
          </TimeSlot>
        ))}
        {formData.schedule.length < 10 && (
          <AddTimeButton type="button" onClick={addTimeSlot}>
            + Add Time
          </AddTimeButton>
        )}
      </TimeSlotsContainer>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Medication'}
      </SubmitButton>
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
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
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

const RemoveButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AddTimeButton = styled.button`
  background: none;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
`;

export default AddMedicationForm;