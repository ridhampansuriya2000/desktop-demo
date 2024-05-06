import React from 'react';
import styles from './Input.module.css';

function Input({ id, name, placeholder, ...rest }) {
    return (
        <input
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            className={styles.inputField}
            {...rest}
        />
    );
}

export default Input;
