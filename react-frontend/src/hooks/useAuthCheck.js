import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLoggedIn, userLoggedOut } from '../features/auth/authSlice';
import verifyToken from '../utils/verifyToken';

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const localAuth = localStorage?.getItem('auth');

    if (localAuth) {
      const auth = JSON.parse(localAuth);
      if (auth?.accessToken && auth?.user) {
        verifyToken(auth.accessToken)
          .then((isValid) => {
            if (isValid) {
              dispatch(
                userLoggedIn({
                  accessToken: auth.accessToken,
                  user: auth.user,
                })
              );
            } else {
              // Token is invalid, clear local storage and log user out
              localStorage.removeItem('auth');
              dispatch(userLoggedOut());
            }
          })
          .finally(() => {
            setAuthChecked(true);
          });
      } else {
        // No valid auth data in local storage
        setAuthChecked(true);
      }
    } else {
      // No auth data in local storage
      setAuthChecked(true);
    }
  }, [dispatch]);

  return authChecked && true; // Always returns true after auth check is done
}
