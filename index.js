const incomes = [];
const expenses = [];
const incomeButton = document.querySelector("#incomeButton");
const expenseButton = document.querySelector("#expenseButton");

function getInputValues(incomeOrExpense) {
  const name = document.querySelector(`#${incomeOrExpense}Name`).value;
  const amount = Number(
    document.querySelector(`#${incomeOrExpense}Amount`).value
  );
  return { name, amount };
}

function addIncome() {
  const { name, amount } = getInputValues("income");
  if (name && !isNaN(amount) && amount > 0) {
    incomes.push({ name, amount });
    updateList("income-list", incomes);
    calculateBalance();
  } else {
    alert("Please enter valid name and amount.");
  }
}
incomeButton.addEventListener("click", function () {
  addIncome();
  clearIncomeInputFields();
});

function clearIncomeInputFields() {
  document.querySelector("#incomeName").value = "";
  document.querySelector("#incomeAmount").value = "";
}

function addExpense() {
  const { name, amount } = getInputValues("expense");
  if (name && !isNaN(amount) && amount > 0) {
    expenses.push({ name, amount });
    updateList("expense-list", expenses);
    calculateBalance();
  } else {
    alert("Please enter valid name and amount.");
  }
}
expenseButton.addEventListener("click", function () {
  addExpense();
  clearExpenseInputFields();
});

function clearExpenseInputFields() {
  document.querySelector("#expenseName").value = "";
  document.querySelector("#expenseAmount").value = "";
}

function updateList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${item.name} - ${item.amount} PLN`;

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
  const amountInput = document.createElement("input");
  amountInput.value = item.amount;

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

  document.querySelector("#total-incomes").textContent = `${totalIncomes} PLN`;
  document.querySelector(
    "#total-expenses"
  ).textContent = `-${totalExpenses} PLN`;

  const balanceElement = document.querySelector("#balance");
  const balanceText = `${balance} PLN`;

  if (balance > 0) {
    balanceElement.textContent = `You can spend ${balance} PLN`;
    balanceElement.classList.add("text-success");
    balanceElement.classList.remove("text-danger", "text-dark");
  } else if (balance < 0) {
    balanceElement.textContent = `You are ${balance} PLN in debt`;
    balanceElement.classList.add("text-danger");
    balanceElement.classList.remove("text-success", "text-dark");
  } else {
    balanceElement.textContent = balanceText;
    balanceElement.classList.add("text-dark");
    balanceElement.classList.remove("text-danger", "text-success");
  }
}
