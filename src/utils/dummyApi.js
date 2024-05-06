import data from '../database/data.json';

const fetchData = (key) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(key ? data?.[key] : data);
        }, 1000);
    });
};

export default fetchData;