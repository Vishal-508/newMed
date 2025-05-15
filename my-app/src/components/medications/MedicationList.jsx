import { useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Button, Input } from "../ui/index";
import { useMedications } from "../../hooks/useMedications";
import EditMedicationForm from "./EditMedicationForm";

const MedicationList = ({ medications, refreshMedications }) => {
  const { deleteMedication, logDose, getDoseLogs, updateDoseLog } =
    useMedications();
  const [editingMedication, setEditingMedication] = useState(null);
  const [doseLogs, setDoseLogs] = useState({});
  const [notes, setNotes] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await deleteMedication(id);
        refreshMedications();
      } catch (error) {
        console.error("Error deleting medication:", error);
      }
    }
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
  };

  const handleCancelEdit = () => {
    setEditingMedication(null);
  };

  const handleUpdateSuccess = () => {
    setEditingMedication(null);
    refreshMedications();
  };

  const handleLogDose = async (medicationId, schedule) => {
    try {
      // Find the next scheduled time
      const now = new Date();
      const nextDoseTime = schedule.find((time) => {
        const [hours, minutes] = time.split(":");
        const doseTime = new Date();
        doseTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return doseTime > now;
      });

      await logDose(
        medicationId,
        nextDoseTime || schedule[0], // Use next scheduled time or first if none found
        notes
      );
      setNotes("");
      fetchDoseLogs(medicationId);
    } catch (error) {
      console.error("Error logging dose:", error);
    }
  };

  const handleUpdateLogNotes = async (logId, medicationId) => {
    try {
      await updateDoseLog(logId, { notes });
      setNotes("");
      fetchDoseLogs(medicationId);
    } catch (error) {
      console.error("Error updating log notes:", error);
    }
  };

  const fetchDoseLogs = async (medicationId) => {
    try {
      const logs = await getDoseLogs(medicationId);
      setDoseLogs((prev) => ({
        ...prev,
        [medicationId]: logs,
      }));
    } catch (error) {
      console.error("Error fetching dose logs:", error);
    }
  };

  return (
    <ListContainer>
      {medications.map((med) => (
        <MedicationCard key={med._id}>
          {editingMedication?._id === med._id ? (
            <EditMedicationForm
              medication={editingMedication}
              onCancel={handleCancelEdit}
              onSuccess={handleUpdateSuccess}
            />
          ) : (
            <>
              <MedicationHeader>
                <h3>{med.name}</h3>
                <span>{med.dose}</span>
              </MedicationHeader>
              <Details>
                <p>Frequency: {med.frequency} times/day</p>
                <p>Schedule: {med.schedule.join(", ")}</p>
                {med.category && <p>Category: {med.category}</p>}
                {med.startDate && (
                  <p>
                    Start Date: {new Date(med.startDate).toLocaleDateString()}
                  </p>
                )}
                {med.endDate && (
                  <p>End Date: {new Date(med.endDate).toLocaleDateString()}</p>
                )}
              </Details>

              {/* Dose Log Section */}
              <DoseLogSection>
                <LogForm>
                  <TimeSelect
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  >
                    {med.schedule.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </TimeSelect>
                  <NotesInput
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes (optional)"
                  />
                  <LogButton
                    onClick={() => handleLogDose(med._id, med.schedule)}
                    disabled={!scheduledTime}
                  >
                    Log Dose
                  </LogButton>
                </LogForm>
                <LogsContainer>
                  <LogsTitle>Dose History:</LogsTitle>
                  {doseLogs[med._id]?.length > 0 ? (
                    doseLogs[med._id].map((log) => (
                      <LogItem key={log._id}>
                        <LogInfo>
                          <LogTime>
                            <strong>Status:</strong>{" "}
                            <StatusIndicator status={log.status}>
                              {log.status === "taken" ? "Taken ✓" : "Missed ✗"}
                            </StatusIndicator>
                          </LogTime>

                          {log.scheduledTime && (
                            <ScheduledTime>
                              <strong>Scheduled:</strong>{" "}
                              {new Date(log.scheduledTime).toLocaleString()}
                            </ScheduledTime>
                          )}

                          {log.takenTime && (
                            <ScheduledTime>
                              <strong>Taken At:</strong>{" "}
                              {new Date(log.takenTime).toLocaleString()}
                            </ScheduledTime>
                          )}
                        </LogInfo>

                        {log.notes && (
                          <LogNotes>
                            <strong>Notes:</strong> {log.notes}
                          </LogNotes>
                        )}
                      </LogItem>
                    ))
                  ) : (
                    <NoLogs>No dose logs yet</NoLogs>
                  )}
                </LogsContainer>
                {/* <LogsContainer>
              <LogsTitle>Dose History:</LogsTitle>
              {doseLogs[med._id]?.length > 0 ? (
                doseLogs[med._id].map(log => (
                  <LogItem key={log._id}>
                    <LogInfo>
                      <LogTime>
                        {new Date(log.time).toLocaleTimeString()}
                        <StatusIndicator status={log.status}>
                          {log.status === 'taken' ? '✓' : '✗'}
                        </StatusIndicator>
                      </LogTime>
                      {log.scheduledTime && (
                        <ScheduledTime>
                          (Scheduled: {new Date(log.scheduledTime).toLocaleTimeString()})
                        </ScheduledTime>
                      )}
                    </LogInfo>
                    {log.notes && <LogNotes>{log.notes}</LogNotes>}
                  </LogItem>
                ))
              ) : (
                <NoLogs>No dose logs yet</NoLogs>
              )}
            </LogsContainer> */}
              </DoseLogSection>

              <Actions>
                <Button variant="outline" onClick={() => handleEdit(med)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(med._id)}>
                  Delete
                </Button>
              </Actions>
            </>
          )}
        </MedicationCard>
      ))}
    </ListContainer>
  );
};

// Styled components

const LogForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const TimeSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const LogInfo = styled.div`
  display: flex;
  gap: 100px;
  align-items: center;
`;

const ScheduledTime = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ListContainer = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const MedicationCard = styled(Card)`
  padding: 1.5rem;
`;

const MedicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  span {
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: bold;
  }
`;

const Details = styled.div`
  margin-bottom: 1.5rem;
  p {
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DoseLogSection = styled.div`
  margin: 1.5rem 0;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  margin-bottom: 1rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.successDark};
  }
`;

const LogsContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 1rem;
  display:flex;
  flex-direction:column;
  gap:20;
  justify-content:space-between;
`;

const LogsTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LogItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

const LogTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const StatusIndicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme, status }) =>
    status === "taken" ? theme.colors.success : theme.colors.error};
  color: white;
  font-size: 0.75rem;
`;

const LogNotes = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
`;

const NotesForm = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NotesInput = styled(Input)`
  flex: 1;
  padding: 0.5rem;
`;

const SaveButton = styled(Button)`
  padding: 0.5rem 1rem;
`;

const NoLogs = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  margin: 0;
`;

export default MedicationList;
