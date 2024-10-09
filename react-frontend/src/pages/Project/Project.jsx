import { useEffect, useState } from 'react';
import styles from './Project.module.css';
import { useDispatch, useSelector } from 'react-redux';
import ProjectList from '../../components/List/Project/ProjectList';
import AddProjectModal from '../../components/Modals/AddProjectModal';
import EditProjectModal from '../../components/Modals/EditProjectModal';
import { resetProject } from '../../features/project/projectSlice';
const Project = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const project = useSelector((state) => state.project);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditOpenModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCloseModal = () => {
    setIsEditModalOpen(false);
    dispatch(resetProject());
  };

  useEffect(() => {
    if (project?.id) handleEditOpenModal();
  }, [project?.id]);
  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.project_header}>
          <h2>All Project</h2>

          <button className={styles.addButton} onClick={handleOpenModal}>
            Add Project
          </button>
        </div>
        <ProjectList />
      </div>
      <AddProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={handleEditCloseModal}
        id={project?.id}
      />
    </div>
  );
};

export default Project;
