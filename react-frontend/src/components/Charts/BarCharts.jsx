import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from 'chart.js';
import { useGetPresentEmployeeDataQuery } from '../../features/dashboard/dashboardApi';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: `Date vs Present Employee(${new Date().toLocaleString('default', {
        month: 'long',
      })})`,
    },
  },
};

// const labels = Array.from({ length: 30 }, (_, index) => index + 1);

// const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Employee',
//       data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 101)),
//       backgroundColor: 'rgba(40, 123, 255, 0.5)',
//     },
//   ],
// };

const BarChart = () => {
  const { data, isLoading, isError, isSuccess, error } =
    useGetPresentEmployeeDataQuery();
  let content = null;
  if (isLoading) {
    content = <span>Loading...</span>;
  }
  if (!isLoading && isError) {
    content = <span>{error}</span>;
  }
  if (!isLoading && !isError && isSuccess) {
    content = <Bar options={options} data={data?.data} />;
  }
  return content;
};

export default BarChart;
