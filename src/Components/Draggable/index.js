import React from 'react';
import { FaRegFileAlt, FaFolder } from "react-icons/fa";
import style from './Draggable.module.css';
import {hasOverlapWithBoundaries, hasSamePosition, nearestCoordinate} from "../../utils/commonFunctions";


class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draggableElements: props.draggableElements,
            copyData:props.draggableElements,
            activeElementId: null,
            pos1: 0,
            pos2: 0,
            pos3: 0,
            pos4: 0,
            boundaryWidth: props?.boundaryWidth ||  700,
            boundaryHeight: props?.boundaryHeight || 700,
            elementWidth: 50,
            elementHeight: 70,
            onceCopyDataUpdate:false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.draggableElements !== this.props.draggableElements && !this.state.onceCopyDataUpdate) {
            this.setState({
                copyData: this.props.draggableElements,
                onceCopyDataUpdate:true
            })

        }
    }

    dragMouseDown = (e, id) => {
        e.preventDefault();
        this.setState({
            activeElementId: id,
            pos3: e.clientX,
            pos4: e.clientY,
        });
        document.onmousemove = this.elementDrag;
        document.onmouseup = this.closeDragElement;
    };

    elementDrag = (e) => {
        e.preventDefault();
        let elm = e.target;
        elm.addEventListener('mouseup', this.handleDragLeave);
        if(!['contextDisable']?.some((item => item === e.target.getAttribute('item') ))){
            elm.style.zIndex = 10;
            const { activeElementId, pos3, pos4 } = this.state;
            if (activeElementId !== null) {
                const index = this.props.draggableElements.findIndex(element => element.id === activeElementId);
                if (index !== -1) {
                    const draggableElement = this.props.draggableElements[index];
                    const pos1 = pos3 - e.clientX;
                    const pos2 = pos4 - e.clientY;
                    const newX = draggableElement.left - pos1;
                    const newY = draggableElement.top - pos2;

                    // Check if the new position collides with any other element
                    const collided = this.props.draggableElements.some((element) => {
                        return (
                            element.id !== activeElementId &&
                            newX < element.left + 10 + element.width &&
                            newX + draggableElement.width > element.left -10 &&
                            newY < element.top + 10 + element.height &&
                            newY + draggableElement.height > element.top -10
                        );
                    });

                    // If there's no collision and within boundary, update the position, else find nearest empty position
                    let updatedElements;
                    if ((!collided || true) && newX >= 0 && newY >= 0 && newX + draggableElement.width <= this.props.boundaryWidth && newY + draggableElement.height <= this.props.boundaryHeight ) {
                        updatedElements = this.props.draggableElements.map((element) => {
                            return element.id === activeElementId ? { ...element, left: newX, top: newY } : element;
                        });
                    } else {
                        updatedElements = this.props.draggableElements.map((element) => {
                            if (element.id === activeElementId) {
                                let minDistance = Infinity;
                                let closestX = element.left;
                                let closestY = element.top;
                                this.props.draggableElements.forEach((otherElement) => {
                                    const distance = Math.sqrt(
                                        Math.pow(element.left - otherElement.left, 2) +
                                        Math.pow(element.top - otherElement.top, 2)
                                    );
                                    if (distance < minDistance && !this.isColliding(element.id, otherElement) &&
                                        otherElement.left >= 0 && otherElement.top >= 0 &&
                                        otherElement.left + otherElement.width <= this.props.boundaryWidth &&
                                        otherElement.top + otherElement.height <= this.props.boundaryHeight) {
                                        minDistance = distance;
                                        closestX = otherElement.left;
                                        closestY = otherElement.top;
                                    }
                                });

                                return { ...element, left: closestX, top: closestY };
                            }
                            return element;
                        });
                    }
                    if(['contextDisable']?.some((item => item === e.target.getAttribute('item') ))) return;
                    this.props.setDashboardItems(updatedElements);
                    this.setState({
                        // draggableElements: updatedElements,
                        pos1,
                        pos2,
                        pos3: e.clientX,
                        pos4: e.clientY,
                    });
                }
            }
        }else {
            this.handleDragLeave();
        }
    };

    handleDragLeave = (e) => {
        setTimeout(() => {
            let arr = JSON.parse(JSON.stringify(this.props?.draggableElements?.map(item => ({
                ...item,
                left: nearestCoordinate(item?.left, 'x', this.state.elementWidth, this.state.elementHeight, this.props.boundaryWidth, this.props.boundaryHeight),
                top: nearestCoordinate(item?.top, 'y', this.state.elementWidth, this.state.elementHeight, this.props.boundaryWidth, this.props.boundaryHeight)
            }))))
            let newArr = (hasOverlapWithBoundaries(arr || [], this.props.appBarCoordinates) || hasSamePosition(arr || [], this.props?.draggableElements))
            || (e && (['contextDisable']?.some((item => item === e.target.getAttribute('item')))))
                ? this?.state?.copyData
                : this.props?.draggableElements?.map(item => ({
                    ...item,
                    left: nearestCoordinate(item?.left, 'x', this.state.elementWidth, this.state.elementHeight, this.props.boundaryWidth, this.props.boundaryHeight),
                    top: nearestCoordinate(item?.top, 'y', this.state.elementWidth, this.state.elementHeight, this.props.boundaryWidth, this.props.boundaryHeight)
                }))
            this.props.setDashboardItems(newArr)
            this.setState({
                // draggableElements: newArr,
                copyData: newArr,
            });
            if (e) {
                let elm = e.target;
                elm.style.zIndex = '';
                elm.removeEventListener('mouseup', this.handleDragLeave);
            }
        }, [50])
    };

    handleMouseLeave = (e) =>{
        let elm = e.target;
        elm.style.zIndex = '';
    }

    isColliding = (id, otherElement) => {
        const draggableElement = this.props.draggableElements.find((element) => element.id === id);
        return (
            draggableElement &&
            draggableElement.id !== otherElement.id &&
            draggableElement.left < otherElement.left + otherElement.width &&
            draggableElement.left + draggableElement.width > otherElement.left &&
            draggableElement.top < otherElement.top + otherElement.height &&
            draggableElement.top + draggableElement.height > otherElement.top
        );
    };

    closeDragElement = () => {
        this.setState({ activeElementId: null });
        document.onmouseup = null;
        document.onmousemove = null;
    };

    render() {
        return (
            <div
                ref={this.props.divRef}
                style={{ position: 'relative', width: `${this.props.boundaryWidth}px`, height: `${this.props.boundaryHeight}px` }}
            >
                {this.props.draggableElements.map(element => (
                    <div
                        item='draggable'
                        key={element.id}
                        style={{
                            position: 'absolute',
                            top: element.top + 'px',
                            left: element.left + 'px',
                            width: this.state.elementWidth + 'px',
                            height: this.state.elementHeight + 'px',
                            // border: '1px solid #d3d3d3',
                            cursor: 'pointer',
                        }}
                        onMouseDown={(e) => this.dragMouseDown(e, element.id)}
                        onMouseUp={this.handleDragLeave}
                        onMouseOver={this.handleMouseLeave}
                    >
                        <div onClick={e =>e.stopPropagation()} item='draggable'>
                            {element?.type ?
                                <FaRegFileAlt item='draggable' style={{ color: '#f2f1f4', fontSize: '40px', pointerEvents:'none' }} onClick={e => e.stopPropagation()} />
                                : <FaFolder item='draggable' style={{ color: '#f2f1f4', fontSize: '40px', pointerEvents:'none' }} onClick={e => e.stopPropagation()} />}
                        </div>
                        <div className={style.fileName}>{element?.name}</div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Draggable;
