import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdherenceChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Adherence %',
        data: [85, 92, 78, 90, 88, 95, 80],
        backgroundColor: '#4f46e5',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <ChartContainer>
      <Bar data={data} options={options} />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  height: 300px;
`;

export default AdherenceChart;