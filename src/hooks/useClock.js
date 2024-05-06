import { useState, useEffect } from 'react';

const useClock =()=> {
    const [timeData, setTimeData] = useState({
        hours: '',
        minutes: '',
        seconds: '',
        day: '',
        month: '',
        date: ''
    });

    useEffect(() => {
        const intervalID = setInterval(() => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const day = now.toLocaleString('en-US', { weekday: 'long' });
            const month = now.toLocaleString('en-US', { month: 'long' });
            const date = now.getDate().toString();
            setTimeData({
                hours,
                minutes,
                seconds,
                day,
                month,
                date
            });
        }, 1000);

        return () => clearInterval(intervalID);
    }, []);

    return timeData;
}

export default useClock;
