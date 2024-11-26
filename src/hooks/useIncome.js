import { useState, useEffect } from "react";

const useIncome = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    date: "",
    category: "",
  });
  const [newCategory, setNewCategory] = useState(""); // Yeni kategori

  // localStorage'dan verileri al
  useEffect(() => {
    const savedIncomes = JSON.parse(localStorage.getItem("incomes"));
    const savedCategories = JSON.parse(
      localStorage.getItem("incomeCategories")
    );

    if (savedIncomes) setIncomeList(savedIncomes);
    if (savedCategories) setCategories(savedCategories);
  }, []);

  // Aylık ve Yıllık gelirleri gruplama ve toplamlarını hesaplama
  const groupByMonthAndYear = () => {
    const groupedByMonth = incomeList.reduce((grouped, income) => {
      const { category, amount, date } = income;
      const incomeDate = new Date(date);
      const year = incomeDate.getFullYear();
      const month = incomeDate.getMonth() + 1; // Ayı 1'den başlatıyoruz

      const yearMonth = `${year}-${month}`; // Yıl-Ay formatı

      // Bu ay ve yıl için eğer grup yoksa, başlatıyoruz
      if (!grouped[yearMonth]) {
        grouped[yearMonth] = {};
      }

      // Bu kategori için eğer grup yoksa, başlatıyoruz
      if (!grouped[yearMonth][category]) {
        grouped[yearMonth][category] = 0;
      }

      // Aynı kategori ve aynı tarih için gelirleri topluyoruz
      grouped[yearMonth][category] += parseFloat(amount);

      return grouped;
    }, {});

    return groupedByMonth;
  };

  // Gruplanmış gelir verisi
  const groupedIncomes = groupByMonthAndYear();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddIncome = () => {
    if (
      !formData.name.trim() ||
      !formData.amount ||
      +formData.amount <= 0 ||
      !formData.date ||
      !formData.category.trim()
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const newIncomeList = [...incomeList, formData];
    setIncomeList(newIncomeList);
    localStorage.setItem("incomes", JSON.stringify(newIncomeList));

    setFormData({
      name: "",
      description: "",
      amount: "",
      date: "",
      category: "",
    });
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim().toUpperCase();
    if (!trimmedCategory) {
      alert("Category name cannot be empty.");
      return;
    }
    if (categories.includes(trimmedCategory)) {
      alert("This category already exists.");
      return;
    }

    const updatedCategories = [...categories, trimmedCategory];
    setCategories(updatedCategories);
    localStorage.setItem("incomeCategories", JSON.stringify(updatedCategories));
    setNewCategory(""); // Yeni kategori input'unu temizle
  };

  return {
    incomeList,
    categories,
    groupedIncomes, // Gruplanmış ve toplanmış gelir verisi
    formData,
    newCategory,
    handleInputChange,
    handleAddIncome,
    handleAddCategory,
    setNewCategory,
  };
};

export default useIncome;
