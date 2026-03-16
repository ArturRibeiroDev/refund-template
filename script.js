// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da Lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  value = Number(value) / 100

  amount.value = formatCurrencyBrl(value)
}

function formatCurrencyBrl(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado
  return value
}

form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)
}

function expenseAdd (newExpense) {
  try {
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)

    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    expenseInfo.append(expenseName, expenseCategory)

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    const RemoveIcon = document.createElement("img")
    RemoveIcon.classList.add("remove-icon")
    RemoveIcon.setAttribute("src", "img/remove.svg")

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, RemoveIcon)
    expenseList.append(expenseItem)

    updateTotal()

    formClear()

    /*  Forma bem mais fácil de fazer
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    expenseItem.innerHTML = `
    <img src="./img/${newExpense.category_id}.svg" alt="Ícone de tipo da despesa" />

              <div class="expense-info">
                <strong>${newExpense.expense}</strong>
                <span>${newExpense.category_name}</span>
              </div>

              <span class="expense-amount"><small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}</span>

              <img src="./img/remove.svg" alt="remover" class="remove-icon" />
    `

    // Adiciona as informações no item
    expenseList.append(expenseItem)
    */

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas")
    console.log(error)
  }
}

function updateTotal() {
  try {
    const itens = expenseList.children

    expensesQuantity.textContent = `${itens.length} ${itens.length > 1 ? "despesas" : "despesa"}`


    // Variável para incrementar total;
    let total = 0

    for(let item = 0; item < itens.length; item++) {
      const ItemAmount = itens[item].querySelector(".expense-amount")

      // Remove caracteres não numéricos 
      let value = ItemAmount.textContent.replace(/[^\d,]/g , "").replace(",", ".")

      // Converte o valor para Float.
      value = parseFloat(value)

      // Verifica se é um número válido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número")
      }

      // Incrementar o valor total.
      total += Number(value)

      /* Forma mais fácil de fazer o código acima
          for (const item of itens) {

      const itemAmount = item.querySelector(".expense-amount")

      let value = itemAmount.textContent.replace(/[^\d,]/g , "").replace(",", ".")

      value = parseFloat(value)

      if (isNaN(value)) {
        return alert("Não foi possível calcular o total.")
      }

      total += value
    }
      */
    }

    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    total = formatCurrencyBrl(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento
    expensesTotal.innerHTML = ""

    // Adiciona o symbolo da moeda e o valor
    expensesTotal.append(symbolBRL, total)
    
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon") ) {
    const item = event.target.closest(".expense")
    item.remove()
  }

  updateTotal()
})

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}