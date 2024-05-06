import React from "react";
import styles from './TopBar.module.css';

const TopBar = () =>{
    return(
        <div className={styles.mainContainer} item='contextDisable'>
            <img src='assets/wifi.png' width='25px' height='15px' item='contextDisable'/>
            <img src='assets/sound.png' width='27px' height='17px' item='contextDisable'/>
            <img src='assets/Battery.png' width='27px' height='16px' item='contextDisable'/>
        </div>
    )
};

export default TopBar;