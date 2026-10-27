
const form = document.getElementById("expenseForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const expenseList = document.getElementById("expenseList");
const totalElement = document.getElementById("total");
const budgetElement = document.getElementById("budget");
const remainingElement = document.getElementById("remaining");
const insightElement = document.getElementById("insight");

let budget = Number(localStorage.getItem("studentBudget")) || 5000;
let expenses = JSON.parse(
  localStorage.getItem("studentExpenses") || "[]"
);

function saveData() {
  localStorage.setItem("studentBudget", String(budget));
  localStorage.setItem("studentExpenses", JSON.stringify(expenses));
}

function render() {
  expenseList.replaceChildren();

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  budgetElement.textContent = budget.toFixed(2);
  totalElement.textContent = total.toFixed(2);
  remainingElement.textContent = (budget - total).toFixed(2);

  expenses.forEach((expense, index) => {
    const item = document.createElement("li");
    const details = document.createElement("span");
    details.textContent =
      `${expense.description} — ${expense.category}: ₹${expense.amount.toFixed(2)}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.setAttribute("aria-label", `Delete ${expense.description}`);
    removeButton.addEventListener("click", () => {
      expenses.splice(index, 1);
      saveData();
      render();
    });

    item.append(details, removeButton);
    expenseList.appendChild(item);
  });

  if (total > budget) {
    insightElement.textContent =
      "You are over budget. Review your recent expenses and consider reducing optional spending.";
  } else if (total >= budget * 0.8) {
    insightElement.textContent =
      "You have used at least 80% of your budget. Be careful with your remaining spending.";
  } else {
    insightElement.textContent =
      "You are within budget. Keep tracking your spending to understand your habits.";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    alert("Enter a description and a valid positive amount.");
    return;
  }

  expenses.unshift({
    description,
    amount,
    category: categoryInput.value
  });

  saveData();
  form.reset();
  render();
});

document.getElementById("setBudget").addEventListener("click", () => {
  const input = document.getElementById("budgetInput");
  const newBudget = Number(input.value);

  if (!Number.isFinite(newBudget) || newBudget < 0) {
    alert("Enter a valid budget of zero or more.");
    return;
  }

  budget = newBudget;
  saveData();
  render();
});

document.getElementById("budgetInput").value = budget;
render();
