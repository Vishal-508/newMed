import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Card } from '../ui';
import api from '../../services/api';

const DoseLog = ({ medication }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch logs for this medication
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logs/getLogs', {
        params: {
          medicationId: medication._id,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        }
      });
      setLogs(response.data);
    } catch (err) {
      setError('Failed to fetch dose logs');
    } finally {
      setLoading(false);
    }
  };

  // Log a dose
  const logDose = async () => {
    try {
      setLoading(true);
      await api.post('/logs', {
        medicationId: medication._id,
        time: new Date().toISOString(),
        status: 'taken'
      });
      fetchLogs(); // Refresh logs after logging
    } catch (err) {
      setError('Failed to log dose');
    } finally {
      setLoading(false);
    }
  };

  // Update log notes
  const updateLogNotes = async (logId) => {
    try {
      setLoading(true);
      await api.patch(`/logs/${logId}`, { notes });
      setNotes('');
      fetchLogs(); // Refresh logs after update
    } catch (err) {
      setError('Failed to update notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [medication._id]);

  return (
    <DoseLogContainer>
      <h4>Dose Logs</h4>
      
      <LogButton 
        onClick={logDose} 
        disabled={loading}
      >
        {loading ? 'Logging...' : 'Mark as Taken Now'}
      </LogButton>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <LogList>
        {logs.map(log => (
          <LogItem key={log._id}>
            <LogTime>
              {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <StatusIndicator status={log.status}>
                {log.status === 'taken' ? '✓' : '✗'}
              </StatusIndicator>
            </LogTime>
            
            {log.notes ? (
              <LogNotes>{log.notes}</LogNotes>
            ) : (
              <NotesForm>
                <NotesInput
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                />
                <SaveButton 
                  onClick={() => updateLogNotes(log._id)}
                  disabled={!notes.trim()}
                >
                  Save
                </SaveButton>
              </NotesForm>
            )}
          </LogItem>
        ))}
      </LogList>
    </DoseLogContainer>
  );
};

// Styled components
const DoseLogContainer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogButton = styled(Button)`
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.success};
  &:hover {
    background-color: ${({ theme }) => theme.colors.successDark};
  }
`;

const LogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LogItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
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
    status === 'taken' ? theme.colors.success : theme.colors.error};
  color: white;
  font-size: 0.75rem;
`;

const LogNotes = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NotesForm = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NotesInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  padding: 0.5rem 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 1rem;
`;

export default DoseLog;