import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useMedications } from '../../hooks/useMedications';
import { Card, Button } from '../../components/ui';
import MedicationList from '../../components/medications/MedicationList';
import AdherenceChart from '../../components/dashboard/AdherenceChart';
import CalendarHeatmap from '../../components/dashboard/CalendarHeatmap';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    medications, 
    loading, 
    getTodaysMedications,
    getMedications 
  } = useMedications();
  const [activeTab, setActiveTab] = useState('today');
  const [todaysMeds, setTodaysMeds] = useState([]);

  useEffect(() => {
    if (medications.length > 0) {
      setTodaysMeds(getTodaysMedications());
    }
  }, [medications, getTodaysMedications]);

  const refreshData = async () => {
    await getMedications();
  };

  const handleMarkTaken = async (medId, time) => {
    // Implement dose logging functionality
    console.log(`Marked ${medId} as taken at ${time}`);
    // You would call your dose logging API here
  };

  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>Here's your medication overview</p>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <h3>Active Medications</h3>
          <StatValue>{todaysMeds.length}</StatValue>
        </StatCard>
        <StatCard>
          <h3>Today's Adherence</h3>
          <StatValue>85%</StatValue>
        </StatCard>
        <StatCard>
          <h3>Doses Today</h3>
          <StatValue>
            {todaysMeds.reduce((sum, med) => sum + med.frequency, 0)}
          </StatValue>
        </StatCard>
      </StatsGrid>

      <Tabs>
        <TabButton 
          active={activeTab === 'today'} 
          onClick={() => setActiveTab('today')}
        >
          Today's Medications
        </TabButton>
        <TabButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')}
        >
          Adherence Stats
        </TabButton>
        <TabButton 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </TabButton>
      </Tabs>

      <TabContent>
        {activeTab === 'today' && (
          <>
            <SectionTitle>Upcoming Doses</SectionTitle>
            {loading ? (
              <p>Loading medications...</p>
            ) : todaysMeds.length > 0 ? (
              <MedicationList 
                medications={todaysMeds} 
                onMarkTaken={handleMarkTaken}
                showTimes={true}
              />
            ) : (
              <p>No medications scheduled for today</p>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <SectionTitle>Weekly Adherence</SectionTitle>
            <AdherenceChart />
            
            <SectionTitle>Most Missed Medications</SectionTitle>
            <MissedMedsList>
              <MissedMedItem>
                <span>Paracetamol</span>
                <span>3 missed doses</span>
              </MissedMedItem>
              <MissedMedItem>
                <span>Amoxicillin</span>
                <span>1 missed dose</span>
              </MissedMedItem>
            </MissedMedsList>
          </>
        )}

        {activeTab === 'calendar' && (
          <>
            <SectionTitle>Monthly Overview</SectionTitle>
            <CalendarHeatmap />
          </>
        )}
      </TabContent>

      <RefreshButton onClick={refreshData} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </RefreshButton>
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 100%;
  width: 100svw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;
const WelcomeSection = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.5rem;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1.5rem;
`;



const TabButton = styled.button`
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 3px solid
    ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const TabContent = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
const MissedMedsList = styled.div`
  display: flex;
  flex-direction: column;
color: ${({ theme }) => theme.colors.textPrimary};
  gap: 0.5rem;
`;

const MissedMedItem = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 4px;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;
const RefreshButton = styled(Button)`
  margin-top: 1rem;
  align-self: flex-start;

  @media (max-width: 480px) {
    width: 100%;
  }
`;
export default Dashboard;

