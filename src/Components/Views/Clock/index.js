import React from 'react';
import useClock from "../../../hooks/useClock";
import styles from './Clock.module.css';

function Clock() {
    const timeData = useClock();

    const getOrdinalSuffix = (number) => {
        if (number >= 11 && number <= 13) {
            return 'th';
        }
        const lastDigit = number % 10;
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };

    const formatTime = () => {
        if(timeData.hours && timeData.minutes)
        return `${timeData.hours}:${timeData.minutes}`;
    };

    const formatDate = () => {
        const ordinalSuffix = getOrdinalSuffix(Number(timeData.date));
        if(timeData.day && timeData.month && timeData.date){
            return `${timeData.day}, ${timeData.month} ${timeData.date}${ordinalSuffix}`;
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.timeBox}>{formatTime()}</div>
            <div className={styles.dateBox}>{formatDate()}</div>
        </div>
    );
}

export default Clock;
