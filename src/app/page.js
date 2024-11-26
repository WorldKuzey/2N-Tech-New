"use client"; // Bu satırı unutmayın

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import IncomeComponent from "../components/Income";
import ExpenseComponent from "../components/Expense";
import IncomesChart from "../components/Charts/IncomesChart";
import ExpenseChart from "../components/Charts/ExpensesChart"; // ExpenseChart'ı import etmeyi unutmayın

export default function HomePage() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]); // Gider verilerini yönetmek için state

  // localStorage'dan income verilerini almak
  useEffect(() => {
    const savedIncomes = JSON.parse(localStorage.getItem("incomes"));
    if (savedIncomes) {
      setIncomeData(savedIncomes);
    }

    const savedExpenses = JSON.parse(localStorage.getItem("expenses")); // Gider verilerini localStorage'dan almak
    if (savedExpenses) {
      setExpenseData(savedExpenses);
    }
  }, []);

  // localStorage'dan gelir verisini ekleyip güncelleme
  const updateIncomeData = (newIncome) => {
    const updatedData = [...incomeData, newIncome];
    setIncomeData(updatedData);
    localStorage.setItem("incomes", JSON.stringify(updatedData)); // Veriyi localStorage'a kaydet
  };

  // localStorage'dan gider verisini ekleyip güncelleme
  const updateExpenseData = (newExpense) => {
    const updatedData = [...expenseData, newExpense];
    setExpenseData(updatedData);
    localStorage.setItem("expenses", JSON.stringify(updatedData)); // Veriyi localStorage'a kaydet
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-10">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Gelir ve Gider Takip Uygulaması
        </h2>
        <p className="text-lg mb-10 text-center">
          Gelir ve giderlerinizi düzenli bir şekilde burada takip edin.
        </p>

        {/* Income and Expense Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Income Component */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <IncomeComponent updateIncomeData={updateIncomeData} />

            {/* Income Chart */}
            <div className="mt-6">
              <IncomesChart incomeData={incomeData} />
            </div>
          </div>

          {/* Expense Component */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ExpenseComponent updateExpenseData={updateExpenseData} />

            {/* Expense Chart */}
            <div className="mt-6">
              <ExpenseChart expenseData={expenseData} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
