import { useGetProjectsQuery } from '../../../features/project/projectApi';
import styles from './ProjectList.module.css';
import ProjectListData from './ProjectListData';
const ProjectList = () => {
  const {
    data: projects,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetProjectsQuery();
  let content = null;
  if (isLoading) {
    content = <span>Loading...</span>;
  }
  if (!isLoading && isError) {
    content = <span>{error?.message}</span>;
  }

  if (!isLoading && !isError && isSuccess && projects?.data?.length === 0) {
    content = <span>No project found</span>;
  }
  if (!isLoading && !isError && isSuccess && projects?.data?.length > 0) {
    content = projects?.data.map((item) => (
      <ProjectListData key={item.id} project={item} />
    ));
  }
  return <div className={styles.container}>{content}</div>;
};

export default ProjectList;
