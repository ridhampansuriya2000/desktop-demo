import { useEffect, useState } from 'react';

const useParentSize =(ref)=> {
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const getParentSize = () => {
            if (ref.current) {
                const parentElement = ref.current.parentElement;
                if (parentElement) {
                    const { width, height } = parentElement.getBoundingClientRect();
                    const computedStyle = window.getComputedStyle(parentElement);
                    const paddingLeft = parseFloat(computedStyle.paddingLeft);
                    const paddingRight = parseFloat(computedStyle.paddingRight);
                    const paddingTop = parseFloat(computedStyle.paddingTop);
                    const paddingBottom = parseFloat(computedStyle.paddingBottom);
                    const adjustedWidth = width - (paddingLeft + paddingRight);
                    const adjustedHeight = height - (paddingTop + paddingBottom);
                    setParentSize({ width: adjustedWidth, height: adjustedHeight,paddingTop });
                }
            }
        };

        getParentSize();

        const handleResize = () => {
            getParentSize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [ref]);

    return parentSize;
}

export default useParentSize;
