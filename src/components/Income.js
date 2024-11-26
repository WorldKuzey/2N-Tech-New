"use client";
import React, { useState } from "react";
import useIncome from "../hooks/useIncome";
import AddIncomeButton from "./Button/AddIncomeButton";
import IncomesChart from "./Charts/IncomesChart";

const IncomeComponent = () => {
  const {
    incomeList,
    categories,
    formData,
    newCategory,
    handleInputChange,
    handleAddIncome,
    handleAddCategory,
    setNewCategory,
    groupedIncomes,
  } = useIncome();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [categoryError, setCategoryError] = useState("");
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [timePeriod, setTimePeriod] = useState("monthly"); // State to track time period (monthly or yearly)

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Income name is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.amount || formData.amount <= 0)
      errors.amount = "Amount must be greater than 0.";
    if (!formData.date) errors.date = "Date is required.";
    if (!formData.category) errors.category = "Category is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCategory = () => {
    if (!newCategory.trim()) {
      setCategoryError("Category name is required.");
      return false;
    }
    setCategoryError("");
    return true;
  };

  const handleSubmit = () => validateForm() && handleAddIncome();

  const handleCategoryAdd = () =>
    validateCategory() && handleAddCategory() && toggleModal();

  const toggleChartVisibility = () => setIsChartVisible(!isChartVisible);

  // Filter incomes based on selected time period
  const filteredIncomes =
    timePeriod === "monthly"
      ? groupedIncomes // Aylık gruplama
      : groupedIncomes; // Yıllık gruplama (yıl için benzer işlem yapılabilir)

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Add Income</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["name", "description", "amount", "date"].map((field, idx) => (
          <div key={idx}>
            <input
              type={
                field === "amount"
                  ? "number"
                  : field === "date"
                  ? "date"
                  : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="p-2 border rounded-md text-gray-700 w-full"
            />
            {formErrors[field] && (
              <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
            )}
          </div>
        ))}

        <div>
          <div className="relative flex items-center gap-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 border rounded-md text-gray-700 flex-1"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={toggleModal}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              aria-label="Add a new category"
            >
              +
            </button>
          </div>
          {formErrors.category && (
            <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
          )}
        </div>
      </div>

      <AddIncomeButton onClick={handleSubmit} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter Category Name"
              className="p-2 border rounded-md text-gray-700 w-full mb-4"
            />
            {categoryError && (
              <p className="text-sm text-red-500">{categoryError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleCategoryAdd}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={toggleChartVisibility}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isChartVisible ? "Hide Chart" : "Show Chart"}
        </button>
      </div>

      {isChartVisible && <IncomesChart data={filteredIncomes} />}
    </div>
  );
};

export default IncomeComponent;
