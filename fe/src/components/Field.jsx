import React from "react";

const Field = ({ label, value, onChange, type = "text", min = 0, max }) => (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <input
          type={type}
          className="input"
          value={value}
          onChange={(e) => {
            const numericValue = parseFloat(e.target.value);
            if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
              onChange(numericValue);
            }
          }}
          placeholder={label}
        />
      </div>
    </div>
);

export default Field;