
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMedications } from '../../hooks/useMedications';
import MedicationList from '../../components/medications/MedicationList';
import AddMedicationForm from '../../components/medications/AddMedicationForm';
import { Button, Card } from '../../components/ui';

const Medications = () => {
  const {
    medications: fetchedMedications,
    loading,
    error,
    addMedication,
    deleteMedication,
    updateMedication,
    getMedications,
  } = useMedications();

  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch medications on mount
  useEffect(() => {
    getMedications();
  }, []);

  // Sync medications from hook to local state
  useEffect(() => {
    setMedications(fetchedMedications);
  }, [fetchedMedications]);

  // Refresh medications
  const refreshMedications = async () => {
    await getMedications();
  };

  const handleAdd = async (newMed) => {
    await addMedication(newMed);
    setShowForm(false);
    refreshMedications();
  };

  return (
    <Container>
      <Header>
        <h1>My Medications</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Medication'}
        </Button>
      </Header>

      {showForm && (
        <FormCard>
          <AddMedicationForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        </FormCard>
      )}

      <MedicationList
        medications={medications}
        refreshMedications={refreshMedications}
        onDelete={deleteMedication}
        onUpdate={updateMedication}
      />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 6rem 3rem 3rem 3rem;
  width: 100svw;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const FormCard = styled(Card)`
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

export default Medications;






