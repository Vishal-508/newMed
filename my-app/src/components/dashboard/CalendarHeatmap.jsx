import styled from 'styled-components';

const CalendarHeatmap = () => {
  // This is a simplified version - you might want to use a library like react-calendar-heatmap
  const days = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    count: Math.floor(Math.random() * 5),
  }));

  return (
    <HeatmapContainer>
      <HeatmapGrid>
        {days.map((day, i) => (
          <HeatmapDay 
            key={i} 
            intensity={day.count}
            title={`${day.date.toLocaleDateString()}: ${day.count} doses`}
          />
        ))}
      </HeatmapGrid>
      <HeatmapLegend>
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <LegendDay key={i} intensity={i} />
        ))}
        <span>More</span>
      </HeatmapLegend>
    </HeatmapContainer>
  );
};

const HeatmapContainer = styled.div`
  margin-bottom: 2rem;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 1rem;
`;

const HeatmapDay = styled.div`
  height: 20px;
  background-color: ${({ theme, intensity }) => 
    intensity === 0 ? theme.colors.backgroundSecondary :
    intensity === 1 ? '#d6e4ff' :
    intensity === 2 ? '#9bb9ff' :
    intensity === 3 ? '#5d8eff' :
    '#2962ff'};
  border-radius: 2px;
`;

const HeatmapLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LegendDay = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${({ intensity }) => 
    intensity === 0 ? '#ebedf0' :
    intensity === 1 ? '#d6e4ff' :
    intensity === 2 ? '#9bb9ff' :
    intensity === 3 ? '#5d8eff' :
    '#2962ff'};
  border-radius: 2px;
`;

export default CalendarHeatmap;