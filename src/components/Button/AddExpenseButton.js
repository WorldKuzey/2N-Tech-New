// src/components/Button/AddExpenseButton.js
import React from "react";

const AddExpenseButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Add Expense
    </button>
  );
};

export default AddExpenseButton;
