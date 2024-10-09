import styles from './Settings.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdministratorTable from '../../components/Table/AdministratorDataTable/AdministratorTable';
import AddAdministratorModal from '../../components/Modals/AddAdministratorModal';
import EditAdministratorModal from '../../components/Modals/EditAdministratorModal';
import { resetAdministrator } from '../../features/administrator/administratorSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const administrator = useSelector((state) => state.administrator);
  // console.log(employee);
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
    dispatch(resetAdministrator());
  };

  useEffect(() => {
    if (administrator?.id) handleEditOpenModal();
  }, [administrator?.id]);

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>All Administrators</h2>

          <button className={styles.addButton} onClick={handleOpenModal}>
            Add Administrator
          </button>
        </div>
        <AdministratorTable />
      </div>
      <AddAdministratorModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <EditAdministratorModal
        isOpen={isEditModalOpen}
        onClose={handleEditCloseModal}
        id={administrator?.id}
      />
    </div>
  );
};

export default Settings;
