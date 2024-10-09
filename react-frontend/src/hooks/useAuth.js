import { useSelector } from 'react-redux';

export default function useAuth() {
  const auth = useSelector((state) => state.auth);

  if (auth?.accessToken && auth?.user) {
    if (auth?.user?.super_admin) {
      return 'super_admin';
    } else {
      return 'user';
    }
  } else {
    return false;
  }
}
