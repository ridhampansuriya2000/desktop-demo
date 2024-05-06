import React from "react";
import styles from './NotificationBar.module.css';

const NotificationBar = () =>{
    return(
        <div className={styles.mainContainer} item='contextDisable'>
            <div className={styles.fileButton} item='contextDisable'>File</div>
            <div item='contextDisable'><img src='assets/logo.png' item='contextDisable'/></div>
        </div>
    )
};

export default NotificationBar;