"use client";

import React, { useState } from "react";
import useExpense from "../hooks/useExpense";
import AddExpenseButton from "./Button/AddExpenseButton";
import ExpensesChart from "../components/Charts/ExpensesChart";

const ExpenseComponent = () => {
  const {
    expenseList,
    categories,
    formData,
    newCategory,
    newCategoryLimit,
    warningMessage,
    formErrors,
    categoryError,
    handleInputChange,
    handleAddExpense,
    handleAddCategory,
    setNewCategory,
    setNewCategoryLimit,
  } = useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Harcamaları kategorilere göre gruplama
  const groupedExpenses = expenseList.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + parseFloat(amount);
    return acc;
  }, {});

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Add Expense</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Expense Name"
            className={`p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.name && (
            <span className="text-sm text-red-500 mt-1 block">
              {formErrors.name}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="relative">
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className={`p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full ${
              formErrors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.description && (
            <span className="text-sm text-red-500 mt-1 block">
              {formErrors.description}
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="relative">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className={`p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full ${
              formErrors.amount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.amount && (
            <span className="text-sm text-red-500 mt-1 block">
              {formErrors.amount}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="relative">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 w-full ${
              formErrors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formErrors.date && (
            <span className="text-sm text-red-500 mt-1 block">
              {formErrors.date}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="relative flex items-center gap-2">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex-1"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={toggleModal}
            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            +
          </button>
          {formErrors.category && (
            <span className="text-sm text-red-500 mt-1 block">
              {formErrors.category}
            </span>
          )}
        </div>
      </div>

      <AddExpenseButton onClick={handleAddExpense} />

      {warningMessage && (
        <div className="text-red-500 mt-4">
          <p>{warningMessage}</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter Category Name"
              className="p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4"
            />
            {categoryError && (
              <span className="text-sm text-red-500 mt-1 block">
                {categoryError}
              </span>
            )}
            <input
              type="number"
              value={newCategoryLimit}
              onChange={(e) => setNewCategoryLimit(e.target.value)}
              placeholder="Enter Limit"
              className="p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddCategory();
                  toggleModal();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <ExpensesChart groupedExpenses={groupedExpenses} />
    </div>
  );
};

export default ExpenseComponent;
