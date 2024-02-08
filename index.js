const incomes = [];
const expenses = [];
const incomeButton = document.querySelector("#incomeButton");
const expenseButton = document.querySelector("#expenseButton");
const incomeContainer = document.querySelector("#incomes");
const expenseContainer = document.querySelector("#expenses");

function addIncome() {
  const name = document.querySelector("#incomeName").value;
  const amount = document.querySelector("#incomeAmount").value;

  if (name && !isNaN(amount) && amount > 0) {
    incomes.push({ name, amount });
    updateList("income-list", incomes);
  }
}
incomeButton.addEventListener("click", addIncome);

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);

  if (name && !isNaN(amount) && amount > 0) {
    expenses.push({ name, amount });
    updateList("expense-list", expenses);
  }
}
expenseButton.addEventListener("click", addExpense);

function updateList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.amount} PLN`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-secondary", "btn-sm");
    deleteButton.addEventListener("click", () => deleteItem(listId, index));

    li.appendChild(deleteButton);
    list.appendChild(li);
  });
}

function deleteItem(listId, index) {
  if (listId === "income-list") {
    incomes.splice(index, 1);
    updateList("income-list", incomes);
  } else if (listId === "expense-list") {
    expenses.splice(index, 1);
    updateList("expense-list", expenses);
  }
}
