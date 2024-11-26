// src/context/IncomeContext.js
import React, { createContext, useState, useEffect } from "react";

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomeList, setIncomeList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const savedIncomes = JSON.parse(localStorage.getItem("incomes"));
    const savedCategories = JSON.parse(
      localStorage.getItem("incomeCategories")
    );

    if (savedIncomes) setIncomeList(savedIncomes);
    if (savedCategories) setCategories(savedCategories);
  }, []);

  return (
    <IncomeContext.Provider
      value={{ incomeList, setIncomeList, categories, setCategories }}
    >
      {children}
    </IncomeContext.Provider>
  );
};
