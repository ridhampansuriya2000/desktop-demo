import React from 'react';
import styles from './Checkbox.module.css'; // Import CSS module

function Checkbox({label}) {

    return (
        <label className={styles.customCheckbox}>
            <input
                type="checkbox"
                className={styles.checkboxInput}
                // checked={isChecked}
                // onChange={handleCheckboxChange}
            />
            <span className={styles.checkmark}></span>
            {label}
        </label>
    );
}

export default Checkbox;
