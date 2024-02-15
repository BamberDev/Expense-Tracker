const incomes = [];
const expenses = [];
const incomeForm = document.querySelector("#income-form");
const expenseForm = document.querySelector("#expense-form");
const selectCurrency = document.querySelector("#currency");

let selectedCurrency = "PLN";

selectCurrency.addEventListener("change", () => {
  selectedCurrency = selectCurrency.value;
  calculateBalance();
  updateList("income-list", incomes);
  updateList("expense-list", expenses);
});

function getInputValues(incomeOrExpense) {
  const name = document.querySelector(`#${incomeOrExpense}-name`).value;
  const amount = Number(
    document.querySelector(`#${incomeOrExpense}-amount`).value
  );
  return { name, amount };
}

function addIncome() {
  const { name, amount } = getInputValues("income");
  if (name && !isNaN(amount) && amount > 0) {
    incomes.push({ name, amount });
    updateList("income-list", incomes);
    calculateBalance();
    clearIncomeInputFields();
  } else {
    alert("Please enter valid name and amount.");
  }
}

incomeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addIncome();
});

function clearIncomeInputFields() {
  document.querySelector("#income-name").value = "";
  document.querySelector("#income-amount").value = "";
}

function addExpense() {
  const { name, amount } = getInputValues("expense");
  if (name && !isNaN(amount) && amount > 0) {
    expenses.push({ name, amount });
    updateList("expense-list", expenses);
    calculateBalance();
    clearExpenseInputFields();
  } else {
    alert("Please enter valid name and amount.");
  }
}

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addExpense();
});

function clearExpenseInputFields() {
  document.querySelector("#expense-name").value = "";
  document.querySelector("#expense-amount").value = "";
}

function updateList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${item.name} - ${item.amount} ${selectedCurrency}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-secondary", "btn-sm", "ms-1");
    deleteButton.addEventListener("click", () => deleteItem(listId, index));

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-secondary", "btn-sm", "ms-1");
    editButton.addEventListener("click", () =>
      enableEdit(li, item, listId, index)
    );

    list.appendChild(li);
    li.appendChild(text);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
  });
  calculateBalance();
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

function enableEdit(li, item, listId, index) {
  const text = li.firstChild;
  const editButton = li.childNodes[1];
  const deleteButton = li.lastChild;

  const nameInput = document.createElement("input");
  nameInput.value = item.name;
  nameInput.classList.add("input-window");
  const amountInput = document.createElement("input");
  amountInput.value = item.amount;
  amountInput.classList.add("input-window");

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("btn", "btn-success", "btn-sm", "ms-1");
  saveButton.addEventListener("click", () =>
    saveEdit(li, nameInput, amountInput, listId, index)
  );

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("btn", "btn-danger", "btn-sm", "ms-1");
  cancelButton.addEventListener("click", () =>
    cancelEdit(
      li,
      text,
      editButton,
      deleteButton,
      nameInput,
      amountInput,
      saveButton,
      cancelButton
    )
  );

  li.replaceChild(nameInput, text);
  li.replaceChild(amountInput, editButton);
  li.appendChild(saveButton);
  li.appendChild(cancelButton);
  li.removeChild(deleteButton);
}

function saveEdit(li, nameInput, amountInput, listId, index) {
  const newName = nameInput.value;
  const newAmount = parseFloat(amountInput.value);

  if (newName && !isNaN(newAmount) && newAmount > 0) {
    const updatedItem = { name: newName, amount: newAmount };

    if (listId === "income-list") {
      incomes[index] = updatedItem;
    } else if (listId === "expense-list") {
      expenses[index] = updatedItem;
    }

    updateList(listId, listId === "income-list" ? incomes : expenses);
  } else {
    alert("Please enter valid name and amount.");
  }
}

function cancelEdit(
  li,
  text,
  editButton,
  deleteButton,
  nameInput,
  amountInput,
  saveButton,
  cancelButton
) {
  li.replaceChild(text, nameInput);
  li.replaceChild(editButton, amountInput);
  li.removeChild(saveButton);
  li.removeChild(cancelButton);
  li.appendChild(deleteButton);
}

function calculateBalance() {
  const totalIncomes = incomes.reduce(
    (total, income) => total + income.amount,
    0
  );
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const balance = totalIncomes - totalExpenses;

  const totalIncomesElement = document.querySelector("#total-incomes");
  totalIncomesElement.textContent =
    totalIncomes === 0 ? "" : `${totalIncomes} ${selectedCurrency}`;

  const totalExpensesElement = document.querySelector("#total-expenses");
  totalExpensesElement.textContent =
    totalExpenses === 0 ? "" : `-${totalExpenses} ${selectedCurrency}`;

  const balanceElement = document.querySelector("#balance");

  if (totalIncomes === 0 && totalExpenses === 0) {
    balanceElement.textContent = "";
  } else {
    if (balance > 0) {
      balanceElement.textContent = `You can spend ${balance} ${selectedCurrency}`;
      balanceElement.classList.add("text-success");
      balanceElement.classList.remove("text-danger", "text-dark");
    } else if (balance < 0) {
      balanceElement.textContent = `You are ${balance} ${selectedCurrency} in debt`;
      balanceElement.classList.add("text-danger");
      balanceElement.classList.remove("text-success", "text-dark");
    } else {
      balanceElement.textContent = `0 ${selectedCurrency}`;
      balanceElement.classList.add("text-dark");
      balanceElement.classList.remove("text-danger", "text-success");
    }
  }
}
