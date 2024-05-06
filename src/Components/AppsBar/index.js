import React from "react";
import styles from './AppsBar.module.css';
import fetchData from "../../utils/dummyApi";

const AppsBar = ({appRef}) =>{

    const [apps,setApps] = React.useState([]);

    // just dummy because it's mention in task
    React.useEffect(()=>{
        fetchData('apps')
            .then(data => {
                if (data) {
                    setApps(data);
                } else {
                    alert('No data fetched');
                }
            })
            .catch(error => {
                alert(`error :- ${error}`)
                console.error('Error:', error);
            });
    },[]);

    return(
        <div className={styles.mainContainer} item='contextDisable'>
            <div className={styles.appBox} item='contextDisable' ref={appRef}>
                {apps?.map((item,index) =>(
                    <img src={`${item.src}`} width='60px' height='60px' item='contextDisable' key={index} />
                ))}
            </div>
        </div>
    )
};

export default AppsBar;