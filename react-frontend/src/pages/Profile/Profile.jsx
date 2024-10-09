import ProfileForm from '../../components/Forms/ProfileForm';
import styles from './Profile.module.css';

const Profile = () => {
  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.header}>
          <h2>My Profile</h2>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
};

export default Profile;
