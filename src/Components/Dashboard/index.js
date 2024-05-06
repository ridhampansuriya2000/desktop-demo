import React, { useRef, useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Clock from "../Views/Clock";
import useOutsideClick from "../../hooks/useOutsideClick";
import useParentSize from "../../hooks/useParentSize";
import Draggable from "../Draggable";
import {addNewItem, parentsClicking} from "../../utils/commonFunctions";
import Navbar from "../TopBar";
import AppsBar from "../AppsBar";
import NotificationBar from "../NotificationBar";
import useElementCoordinates from "../../hooks/useElementCoordinates";
import fetchData from "../../utils/dummyApi";

const closeContextMenu = (ref) =>{
    const subContextMenu = ref.current;
    subContextMenu.style.display = 'none';
};

function Dashboard() {
    const divRef = useRef(null);
    const appBarRef = useRef(null);
    const parentSize = useParentSize(divRef);
    const appBarCoordinates = useElementCoordinates(appBarRef);

    const contextMenuRef = useRef(null);
    const subContextMenuRef = useRef(null);
    const popupRef = useRef(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupType, setPopupType] = useState('');
    const [dashboardItems, setDashboardItems] = useState([]);

    const [popupName, setPopupName] = useState('');
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        function handleClickOutside(event) {
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // just dummy because it's mention in task
    React.useEffect(()=>{
        fetchData('storageItems')
            .then(data => {
                if (data) {
                    setDashboardItems(data);
                } else {
                    alert('No data fetched');
                }
            })
            .catch(error => {
                alert(`error :- ${error}`)
                console.error('Error:', error);
            });
    },[]);

    useOutsideClick(subContextMenuRef,()=>closeContextMenu(subContextMenuRef));
    useOutsideClick(contextMenuRef,()=>closeContextMenu(contextMenuRef));
    useOutsideClick(popupRef,handlePopupCancel);

    function showContextMenu(e,ref,openRef) {
        console.log("event",e)
        e.preventDefault();
        if(!openRef){
            closeContextMenu(subContextMenuRef)
        }
        if(['draggable','contextDisable']?.some((item => item === e.target.getAttribute('item') ))) return;
        // const contextMenu = contextMenuRef.current;
        const contextMenu = ref.current;
        contextMenu.style.left = `0px`;
        contextMenu.style.top = `0px`;
        contextMenu.style.display = 'block';
        contextMenu.style.visibility = 'hidden';
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        let left = e.clientX;
        let top = e.clientY;

        // Adjust position if context menu exceeds screen dimensions
        if (left + menuWidth > screenWidth) {
            left -= menuWidth;
        }
        if (top + menuHeight > screenHeight) {
            top -= menuHeight;
        }

        contextMenu.style.display = 'block';
        if(openRef){
            let {
                top,
                right,
                bottom,
                left,
            } = e.target?.getBoundingClientRect()
            if(screenWidth - right > menuWidth){
                contextMenu.style.left = `${left+menuWidth}px`;
            }else contextMenu.style.left = `${left-menuWidth}px`;


            if(screenHeight - top > menuHeight){
                contextMenu.style.top = `${top}px`;
            }else {
                contextMenu.style.top = `${bottom-menuHeight}px`;
            }
        }else{
            contextMenu.style.left = `${left}px`;
            contextMenu.style.top = `${top}px`;
        }
        contextMenu.style.visibility = 'visible';
    }


    function handleAddFolder(e) {
        setPopupType('');
        setPopupVisible(true);
        setPopupPosition({
            x: (window.innerWidth - 250) / 2,
            y: (window.innerHeight - 100) / 2
        });
        closeContextMenu(contextMenuRef);
    }

    function handleAddFile(e, fileType) {
        setPopupType(fileType);
        setPopupVisible(true);
        setPopupPosition({
            x: (window.innerWidth - 250) / 2,
            y: (window.innerHeight - 100) / 2
        });
        closeContextMenu(contextMenuRef);
        closeContextMenu(subContextMenuRef);
    }


    function handlePopupConfirm() {
        if (popupName.trim() !== '') {
            const newItem = { type: popupType, name: popupName+`${popupType ? '.'+popupType : ''}`, id: Date.now(), height:70,width:50 };

            setDashboardItems([...addNewItem(dashboardItems, newItem, parentSize?.width, parentSize?.height)]);
        }
        setPopupVisible(false);
        setPopupName('');
    }

    function handlePopupCancel() {
        setPopupVisible(false);
        setPopupName('');
    }

    return (
        <div
            className={styles.dashboardContainer}
            onContextMenu={(e) => showContextMenu(e,contextMenuRef)}
        >
            <div className={styles.topbarBox} item='contextDisable'>
                <Navbar />
            </div>
            <div className={styles.appsbarBox}>
                <AppsBar appRef={appBarRef}/>
            </div>
            <div className={styles.clockBox}>
                <Clock/>
            </div>
            <div className={styles.draggableBox} id={''} >
                <Draggable
                    draggableElements={dashboardItems}
                    boundaryWidth={parentSize?.width}
                    boundaryHeight={parentSize?.height}
                    divRef={divRef}
                    setDashboardItems={setDashboardItems}
                    appBarCoordinates={appBarCoordinates}
                />
            </div>

            <NotificationBar />

            {popupVisible && (
                <div
                    ref={popupRef}
                    className={styles.popup}
                    style={{ left: popupPosition.x, top: popupPosition.y }}
                    item='draggable'
                >
                    <input
                        type="text"
                        placeholder="Enter file name"
                        value={popupName}
                        onChange={(e) => setPopupName(e.target.value)}
                        item='draggable'
                    />
                    <button onClick={handlePopupConfirm} item='contextDisable'>Confirm</button>
                    {/*<button onClick={handlePopupCancel}>Cancel</button>*/}
                </div>
            )}
            <div className={styles.contextMenu} ref={contextMenuRef}>
                <ul>
                    <li onClick={handleAddFolder}>Add Folder</li>
                    <li onClick={(e)=>showContextMenu(e,subContextMenuRef,contextMenuRef)} id={'add-file'}>
                        <span onClick={(e)=>parentsClicking(e,'add-file')}>Add File</span>
                        <span onClick={(e)=>parentsClicking(e,'add-file')}> > </span>
                    </li>
                    <li >Other option 1</li>
                    <li >Other option 2</li>
                    <li >Other option 3</li>
                    <li >Other option 4</li>
                    <li >Other option 5</li>
                </ul>
            </div>
            <div className={styles.contextMenu} ref={subContextMenuRef}>
                <ul>
                    <li onClick={(e) => handleAddFile(e, 'docx')}>Word</li>
                    <li onClick={(e) => handleAddFile(e, 'xlsx')}>Excel</li>
                    <li onClick={(e) => handleAddFile(e, 'pptx')}>PowerPoint</li>
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
