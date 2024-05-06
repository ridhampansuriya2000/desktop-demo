export function roundToNearestInteger(number) {
    if (number - Math.floor(number) < 0.5) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

export function nearestCoordinate(coordinate, axis, elementWidth, elementHeight, boundaryWidth, boundaryHeight, existingItems) {
    const spacing = 20;
    let num = roundToNearestInteger(((coordinate - 10) / (axis === 'x' ? elementWidth + spacing : elementHeight + spacing)) + 1);
    let adjustedCoordinate = ((num - 1) * (axis === 'x' ? elementWidth + spacing : elementHeight + spacing)) + 10;

    if (axis === 'x') {
        if (adjustedCoordinate + elementWidth > boundaryWidth) {
            adjustedCoordinate = boundaryWidth - elementWidth - spacing;
        }
    } else {
        if (adjustedCoordinate + elementHeight > boundaryHeight) {
            adjustedCoordinate = boundaryHeight - elementHeight - spacing;
        }
    }

    if (!Array.isArray(existingItems)) {
        existingItems = [];
    }

    for (const item of existingItems) {
        if (axis === 'x' && item.left === adjustedCoordinate) {
            adjustedCoordinate += elementWidth + spacing;
        } else if (axis === 'y' && item.top === adjustedCoordinate) {
            adjustedCoordinate += elementHeight + spacing;
        }
    }

    return adjustedCoordinate;
}


export function addNewItem(array, newItem, boundaryWidth, boundaryHeight) {

    let allowCordinates = [];
    let maxTop = null;
    let maxLeft = null;

    outerLoop:
        for (let i = 10; i <= boundaryWidth -  (50 + 10); i = i + 50 + 20) {
            for (let j = 10; j <= boundaryHeight -  (70 + 20); j += 70 + 20) {
                allowCordinates.push({ x: i, y: j });
                if (array?.every((item) => (item?.left != i || item?.top != j))) {
                    maxTop = j;
                    maxLeft = i;
                    break outerLoop;
                }
            }
        }

    const newItemWithCoordinates = {
        ...newItem,
        top: maxTop,
        left: maxLeft
    };

    array.push(newItemWithCoordinates);

    return array;
}




export function hasSamePosition(items,preItems) {
    const positions = new Set();
    for (const item of items) {
        const positionKey = `${item.top},${item.left}`;
        if (positions.has(positionKey)) {
            return true;
        }
        positions.add(positionKey);
    }
    return false;
}

export function hasOverlapWithBoundaries(items, boundary) {
    console.log("aaaa",items, boundary);
    for (const item of items) {
        const { left, top, width, height } = item;
        const right = left + width;
        const bottom = top + height;

        if (left && right && top && bottom &&
            left < boundary?.right &&
            right > boundary?.left &&
            top < boundary?.bottom &&
            bottom > boundary?.top
        ) {
            return true;
        }
    }
    return false;
}

export const parentsClicking = (e,parentId) =>{
    e.stopPropagation();
    const parent = document.getElementById(parentId);
    parent.click();
}


