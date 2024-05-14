let listArray = JSON.parse(localStorage.getItem("expenseArr")) || [];
function saveToStorage() {
  localStorage.setItem("expenseArr", JSON.stringify(listArray));
}

document
  .querySelector(".form-submit-button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("submit-button")) {
      submitClickEvent();
      checkListQuantity();
    } else if (event.target.classList.contains("re-edit-button")) {
      updateClickEvent();
    }
  });

checkListQuantity();
function checkListQuantity() {
  if (listArray.length === 0) {
    document.querySelector(".expense-list").classList.remove("expense-summary");
  } else {
    document.querySelector(".expense-list").classList.add("expense-summary");
  }
}

function submitClickEvent() {
  const descInput = document.querySelector(".description").value;
  const categoryInput = document.querySelector(".category").value;
  const amountInput = document.querySelector(".amount").value;

  if (!descInput || !categoryInput || !amountInput) {
    alert("Please fill out the required fields with relevant data");
  } else {
    if (amountInput > 0) {
      listArray.push({
        descInput,
        categoryInput,
        amountInput,
      });
      saveToStorage();
      renderList();
      displayStatus("added");
    } else {
      alert("Amount must be greater than 0");
    }
  }
}

function updateClickEvent() {
  const descInput = document.querySelector(".description");
  const categoryInput = document.querySelector(".category");
  const amountInput = document.querySelector(".amount");

  removeAttributeValues();

  const newdescInput = descInput.value;
  const newCategoryInput = categoryInput.value;
  const newAmountInput = amountInput.value;

  const formSubmitButton = document.querySelector(".form-submit-button");
  const indexValue = formSubmitButton.getAttribute("valueIndexId");

  listArray.splice(indexValue, 1, {
    descInput: newdescInput,
    categoryInput: newCategoryInput,
    amountInput: newAmountInput,
  });

  if (!formSubmitButton.classList.contains("submit-button")) {
    formSubmitButton.classList.add("submit-button");
  }

  formSubmitButton.textContent = "Add Expenses";
  formSubmitButton.classList.remove("re-edit-button");
  formSubmitButton.removeAttribute("valueIndexId");
  document.querySelector(".delete-button").disabled = false;
  saveToStorage();
  renderList();
  displayStatus("update");
}

renderList();
function renderList() {
  let html = "";
  ``;
  listArray.forEach((listItem, index) => {
    html += `
  <tr>
  <td><input type="checkbox" class="check-box" data-index="${index}" value="${index}"></td>
  <td>${listItem.descInput}</td>
  <td>${listItem.categoryInput}</td>
  <td>${listItem.amountInput}</td>
  </tr>
  `;
  });

  document.querySelector(".table-body").innerHTML = html;

  document.querySelector(".description").value = "";
  document.querySelector(".category").value = "";
  document.querySelector(".amount").value = "";

  checkCheckBox();
}

document.querySelector(".reset-button").addEventListener("click", () => {
  if (listArray.length !== 0) {
    const confirmation = confirm("Do you want to reset the list");
    if (confirmation) {
      localStorage.removeItem("expenseArr");
      listArray = [];
      checkListQuantity();
    }
  } else {
    alert("List is empty");
  }
});

checkCheckBox();
function checkCheckBox() {
  const checkBox = document.querySelectorAll(".check-box");

  checkBox.forEach((checkbox) => {
    checkbox.addEventListener("click", (event) => {
      checkBox.forEach((cB) => {
        if (cB !== checkbox) {
          cB.checked = false;
        }
      });

      const editButton = document.querySelector(".edit-button");
      const deleteButton = document.querySelector(".delete-button");

      if (checkbox.checked) {
        editButton.setAttribute("valueId", `${checkbox.dataset.index}`);
        deleteButton.setAttribute("valueId", `${checkbox.dataset.index}`);
        event.stopImmediatePropagation();
      } else {
        if (
          editButton.hasAttribute("valueId") ||
          deleteButton.hasAttribute("valueId")
        ) {
          removeAttributeValues();
        }
      }
    });
  });
}

document.querySelector(".edit-button").addEventListener("click", () => {
  const indexValue = document
    .querySelector(".edit-button")
    .getAttribute("valueId");
  if (indexValue) {
    document.querySelector(".delete-button").disabled = true;
    editList(indexValue);
  }
});

document.querySelector(".delete-button").addEventListener("click", () => {
  const indexValue = document
    .querySelector(".delete-button")
    .getAttribute("valueId");
  if (indexValue) {
    deleteList(indexValue);
    checkListQuantity();
  }
});

function editList(indexValue) {
  if (indexValue) {
    let matchingItem = listArray[indexValue];

    const descInput = document.querySelector(".description");
    const categoryInput = document.querySelector(".category");
    const amountInput = document.querySelector(".amount");

    descInput.value = matchingItem.descInput;
    categoryInput.value = matchingItem.categoryInput;
    amountInput.value = matchingItem.amountInput;

    const formSubmitButton = document.querySelector(".form-submit-button");

    formSubmitButton.classList.add("re-edit-button");

    if (formSubmitButton.classList.contains("submit-button")) {
      formSubmitButton.classList.remove("submit-button");
    }

    formSubmitButton.textContent = "Update";

    formSubmitButton.setAttribute("valueIndexId", `${indexValue}`);
  }
}

function deleteList(index) {
  listArray.splice(index, 1);
  removeAttributeValues();
  saveToStorage();
  renderList();
  displayStatus("delete");
}

function removeAttributeValues() {
  document.querySelector(".edit-button").removeAttribute("valueId");
  document.querySelector(".delete-button").removeAttribute("valueId");
}

let timeOutId;

function displayStatus(status) {
  const outputStatus = document.querySelector(".display-status");
  if (!outputStatus.classList.contains("status-visible")) {
    outputStatus.classList.add("status-visible");
  }

  switch (status) {
    case "added":
      outputStatus.textContent = "Item added to the list";
      outputStatus.classList.add("success");
      break;
    case "update":
      outputStatus.textContent = "Edit successfully";
      outputStatus.classList.add("success");
      break;
    case "delete":
      outputStatus.textContent = "Item removed";
      outputStatus.classList.add("remove");
      break;
  }
  setTimeout(() => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      outputStatus.classList.remove("status-visible");
      if (
        outputStatus.classList.contains("success") ||
        outputStatus.classList.contains("remove")
      ) {
        outputStatus.classList.remove("success");
        outputStatus.classList.remove("remove");
      }
    }, 1500);
  });
}
