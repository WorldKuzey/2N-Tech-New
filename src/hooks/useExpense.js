import { useState, useEffect } from "react";

const useExpense = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    date: "",
    category: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryLimit, setNewCategoryLimit] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [categoryError, setCategoryError] = useState("");

  // LocalStorage'dan veri yükleme
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses"));
    const savedCategories = JSON.parse(
      localStorage.getItem("expenseCategories")
    );

    if (savedExpenses) setExpenseList(savedExpenses);
    if (savedCategories) setCategories(savedCategories);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Expense name is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0)
      errors.amount = "Amount must be a positive number.";
    if (!formData.date) errors.date = "Date is required.";
    if (!formData.category) errors.category = "Category is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddExpense = () => {
    if (validateForm()) {
      const newExpense = { ...formData, id: Date.now() };
      const updatedExpenseList = [...expenseList, newExpense];
      setExpenseList(updatedExpenseList);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenseList));
      setFormData({
        name: "",
        description: "",
        amount: "",
        date: "",
        category: "",
      });
      setWarningMessage("");
    } else {
      setWarningMessage("Please fill all fields correctly.");
    }
  };

  const handleAddCategory = () => {
    if (!newCategory || !newCategoryLimit) {
      setCategoryError("Both category name and limit are required.");
      return;
    }
    const updatedCategories = [
      ...categories,
      { name: newCategory, limit: newCategoryLimit },
    ];
    setCategories(updatedCategories);
    localStorage.setItem(
      "expenseCategories",
      JSON.stringify(updatedCategories)
    );
    setNewCategory("");
    setNewCategoryLimit("");
    setCategoryError("");
  };

  return {
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
  };
};

export default useExpense;
