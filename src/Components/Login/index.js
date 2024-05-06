import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Checkbox from "../Views/Checkbox";
import Input from "../Views/Input";
import Button from "../Views/Button";

function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/dashboard');
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.formWrapper}>
                <div className={styles.flexCen}>
                    <img src='assets/logo.png' />
                </div>
                <div className={styles.formContainer}>
                    <div className={styles.userContainer}>
                        <img src='assets/Ellipse 33.png' />
                    </div>
                    <form className={styles.form}>
                        <div className={styles.formTitle}>Welcome back...</div>
                        <Input id="username" name="username" placeholder="Username" required />
                        <Input type='password' id="password" name="password" placeholder="Password" autocomplete="new-password" required />
                        <Checkbox label='Remember me' />
                        <Button onClick={handleLogin}>Login</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;