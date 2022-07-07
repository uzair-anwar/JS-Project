let inputValue = document.querySelector("#input-screen");
let outputValue = document.querySelector("#output-screen");
let button = document.querySelectorAll(".btn");
let history_element = document.querySelector(".memory");
let show_variables = document.querySelector(".show-var");
let historySection = document.querySelector(".var-history");
let errorSection = document.querySelector("#error");
let showError = false;
let historyButton = false;
let showVarBtn = false;
let variables = new Map();

/*============ For getting the value of btn, Here we use for loop ============*/
for (item of button) {
  item.addEventListener("click", (e) => {
    btnText = e.target.value;
    inputValue.value += btnText;
    e.target.blur();
    inputValue.focus();
  });
}

//function to remove values from both fields
function remove() {
  inputValue.value = "";
  outputValue.value = "";
}

//function for removing a element
function backSpace() {
  inputValue.value = inputValue.value.substr(0, inputValue.value.length - 1);
}

//function for solving equation
function solve() {
  try {
    const PI = 3.1415;
    const E = 2.7182;
    outputValue.value = "";
    var expression = inputValue.value;
    if (expression.length == 0) {
      throw new Error("Empty");
    }
    for (const [key, value] of variables) {
      let varRegExp = new RegExp(`\\b${key}\\b`, "gi");
      expression = expression.replace(varRegExp, value);
    }
    if (expression.includes("eπ") || expression.includes("πe")) {
      throw new Error("NaN");
    }
    let eulerRegExp = new RegExp(`\\b${"e"}\\b`, "gi");
    expression = expression.replace("π", PI.toString());
    expression = expression.replace(eulerRegExp, E.toString());
    if (
      !expression.includes("sin") ||
      !expression.includes("cos") ||
      !expression.includes("tan") ||
      !expression.includes("sqrt")
    ) {
      let tempExpression = expression
        .replace("sin", "")
        .replace("cos", "")
        .replace("tan", "")
        .replace("sqrt", "");
      if (/[a-z]/i.test(tempExpression) || /[A-Z]/i.test(tempExpression)) {
        throw new Exception("NaN");
      }
    }
    result = evaluate(expression);
    if (result == "Infinity") {
      throw new Error("Infinity");
    } else if (result.toString() == "NaN" || result == "Invalid Expression") {
      throw new Error("NaN");
    }

    const tempResult = parseFloat(result);
    const finalResult = Math.round(tempResult * 10000) / 10000;
    outputValue.value = finalResult;

    history_element.innerHTML += `
    <div><button id="${expression}" value="${finalResult}" class"historyButton" name="${expression}">
    ${expression + " = " + finalResult}
    </button>
    <button id="${expression}" name="delete">Delete</button>
    </div>`;
  } catch (Exception) {
    if (Exception.message == "Infinity")
      outputValue.value = "Second number is zero";
    else if (Exception.message == "Empty")
      outputValue.value = "Input Value is Empty";
    else outputValue.value = "Expression is not valid";
  }
}

//function for creating variables
function createVariable() {
  let key = document.getElementById("variable-key").value;
  let targetValue = document.getElementById("variable-value").value;
  try {
    if (key == "" || targetValue == "") {
      errorSection.style.display = "block";
      document.getElementById("error").value = "Fields are empty";
    } else if (!isNaN(key)) {
      throw new Error("Key can not be a Number");
    } else if (isNaN(targetValue)) {
      throw new Error("Value is not a Number");
    } else if (
      key.toLowerCase() == "tan" ||
      key.toLowerCase() == "cos" ||
      key.toLowerCase() == "sin" ||
      key.toLowerCase() == "sqrt" ||
      key.toLowerCase() == "pi" ||
      key.toLowerCase() == "e"
    ) {
      errorSection.style.display = "block";
      document.getElementById("error").value =
        "Reserve variable can't be declare";
    } else if (variables.has(key)) {
      errorSection.style.display = "block";
      document.getElementById("error").value = "Variable is already declared";
    } else {
      variables.set(key, targetValue);
      document.getElementById("variable-key").value = "";
      document.getElementById("variable-value").value = "";
      show_variables.innerHTML += `
                <div><button id=${key} value=${targetValue} name="putvar">${
        key + " = " + targetValue
      }</button>
                <button id=${key} name="deletevar">Delete</button>
                </div>`;
      errorSection.style.display = "block";
      document.getElementById("error").value =
        "Variable is created successfully!";
      show_variables.style.display = "block";
      showVarBtn = true;
    }
  } catch (Exception) {
    errorSection.style.display = "block";
    document.getElementById("error").value = Exception.message;
  }
}

//function for showning histroy
function showHistory() {
  if (!historyButton) {
    historySection.style.display = "block";
    historyButton = true;
  } else {
    historySection.style.display = "none";
    historyButton = false;
  }
}

//Event for Enter or backspace
inputValue.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    solve();
  }
});

//Event for detele histroy or select histroy
history_element.addEventListener("click", (event) => {
  const TARGET_BTN = event.target;
  if (TARGET_BTN.name == "delete") {
    let target = document.getElementById(TARGET_BTN.id);
    target.parentElement.remove();
  } else {
    inputValue.value = TARGET_BTN.id;
    outputValue.value = TARGET_BTN.value;
  }
});

//Event for detele variable or select value of variable
show_variables.addEventListener("click", (event) => {
  const TARGET_BTN = event.target;
  if (TARGET_BTN.name == "deletevar") {
    let target = document.getElementById(TARGET_BTN.id);
    variables.delete(target.id);
    target.parentElement.remove();
  } else if (TARGET_BTN.name == "putvar") {
    inputValue.value += TARGET_BTN.id;
  }
});

//function for show variables
function showVariables() {
  if (!showVarBtn) {
    show_variables.style.display = "block";
    showVarBtn = true;
  } else {
    show_variables.style.display = "none";
    showVarBtn = false;
  }
}

//function for Error display
function showErrorInput() {
  errorSection.style.display = "none";
}

