import { useState, useEffect } from 'react';

const useElementCoordinates =(elementRef)=> {
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        const calculateCoordinates = () => {
            const element = elementRef.current;
            if (!element) return;

            const { left, top, right, bottom, width, height } = element.getBoundingClientRect();

            setCoordinates({ left, top, right, bottom, width, height });
        };

        calculateCoordinates();
    }, [elementRef]);

    return coordinates;
}

export default useElementCoordinates;
