import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../../features/auth/authApi';
import styles from './LoginForm.module.css';
const LoginForm = () => {
    const notify = (message) =>
        toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });
    const [login, { data, isLoading, error: responseError }] =
        useLoginMutation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: 'sa000565@gmail.com',
        password: '12345678',
    });
    // const [error, setError] = useState('');

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // const router = useRouter();

    useEffect(() => {
        if (data?.success && data?.data?.access_token && data?.data?.user) {
            navigate('/dashboard');
            notify(data?.message);
        }
        if (data && !data?.success) {
            // setError(data?.message);
            notify(data?.message);
        }
        if (!isLoading && responseError) {
            // setError(responseError.message);
            notify(responseError.message);
        }
    }, [data, navigate, responseError, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            // setError('');
            login({
                email: formData.email,
                password: formData.password,
            });
        }
    };
    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div className={styles.txt_field}>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <span></span>
                <label>Email</label>
                {formErrors.email && (
                    <div className={styles.error}>{formErrors.email}</div>
                )}
            </div>
            <div className={styles.txt_field}>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <span></span>
                <label>Password</label>
                {formErrors.password && (
                    <div className={styles.error}>{formErrors.password}</div>
                )}
            </div>
            <input type="submit" value="Login" disabled={isLoading} />
            {/* {error && <div className={styles.error}>{error}</div>} */}
        </form>
    );
};

export default LoginForm;
