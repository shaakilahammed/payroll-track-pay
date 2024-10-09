import styles from './CardList.module.css';
import Card from './Card';
import { FaDollarSign } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { BsHourglass } from 'react-icons/bs';
import { useGetStatsTodayQuery } from '../../features/dashboard/dashboardApi';

const iconsMap = {
  FaDollarSign: <FaDollarSign />,
  IoMdPeople: <IoMdPeople />,
  BsHourglass: <BsHourglass />,
};

const CardList = () => {
  const {
    data: stats,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetStatsTodayQuery();

  let content = null;
  if (isLoading) {
    content = <span>Loading...</span>;
  }
  if (!isLoading && isError) {
    content = <span>{error}</span>;
  }
  if (!isLoading && !isError && isSuccess) {
    content = stats?.data?.map((card, index) => {
      const IconComponent = iconsMap[card.icon]; // Get the appropriate icon component
      return <Card key={index} {...card} icon={IconComponent} />;
    });
  }
  return <div className={styles.container}>{content}</div>;
};

export default CardList;
