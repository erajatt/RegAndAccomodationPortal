import React, { useState, useEffect } from "react";
import "./dropdownInput.css";

const DropdownTextInput = ({ inputValue, handleInputChange }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const maxOption = 999;
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    const options = Array.from({ length: maxOption + 1 }, (_, i) =>
      String(i).padStart(3, "0")
    );
    setFilteredOptions(options);
  }, []);

  const handleInputInternalChange = (event) => {
    const value = event.target.value;
    handleInputChange(value); // Pass the input value to the parent component
    setShowWarning(!filteredOptions.includes(value));
  };

  return (
    <div>
      <label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputInternalChange} // Use the internal handler
          list="options"
        />
        <datalist id="options">
          {filteredOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </label>
      {showWarning && <p className="warning">Value not in options</p>}
    </div>
  );
};

export default DropdownTextInput;
