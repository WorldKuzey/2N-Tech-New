// src/components/Button/AddIncomeButton.js
import React from "react";

const AddIncomeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
    >
      Add Income
    </button>
  );
};

export default AddIncomeButton;
