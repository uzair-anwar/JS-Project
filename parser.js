//Parser Function
function evaluate(expression) {
  try {
    let tokens = expression.split("");
    let values = [];
    let operators = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] == " ") {
        continue;
      }
      debugger
      if (tokens[i] >= "0" && tokens[i] <= "9") {
        let sbuf = "";
        while (i < tokens.length && ((tokens[i] >= "0" && tokens[i] <= "9") || tokens[i] == ".")
        ) {
          sbuf = sbuf + tokens[i++];
        }
        values.push(parseFloat(sbuf));
        i--;
      } else if (tokens[i] == "(") {
        operators.push(tokens[i]);
      } else if (tokens[i] == ")") {
        if (!operators.includes("(")) {
          throw new Exception()
        }
        while (operators[operators.length - 1] != "(" && operators.length != 0) {
          values.push(applyOp(operators.pop(), values.pop(), values.pop()));
        }
        operators.pop();
        let getOp = operators.pop();
        // if (getOp == undefined) {
        //   throw new Exception()
        // }
        operators.push(getOp);
        if (getOp == "cos" || getOp == "sin" || getOp == "tan" || getOp == "sqrt") {
          let newPushvalue = applyUnOp(operators.pop(), values.pop());
          values.push(newPushvalue);
        }
      }
      else if (tokens[i] == "+" || tokens[i] == "-" || tokens[i] == "*" || tokens[i] == "/") {
        if (i == 0 && (tokens[i] == "-" || tokens[i] == "+")) {
          let sbuf = tokens[i];
          i++;
          if (tokens[i] >= "0" && tokens[i] <= "9") {
            while (i < tokens.length && ((tokens[i] >= "0" && tokens[i] <= "9") || tokens[i] == ".")) {
              sbuf = sbuf + tokens[i++];
            }
            values.push(parseFloat(sbuf));
            i--;
          }
        } else if (i != 0 && (tokens[i - 1] == "+" || tokens[i - 1] == "-")) {
          let sbuf = tokens[i];
          i++;
          if (tokens[i] >= "0" && tokens[i] <= "9") {
            while (i < tokens.length && ((tokens[i] >= "0" && tokens[i] <= "9") || tokens[i] == ".")) {
              sbuf = sbuf + tokens[i++];
            }
            values.push(parseFloat(sbuf));
            i--;
          }
        } else {
          while (operators.length > 0 && values.length > 1 && hasPrecedence(tokens[i], operators[operators.length - 1])) {
            values.push(applyOp(operators.pop(), values.pop(), values.pop()));
          }
          operators.push(tokens[i]);
        }
      } else if (tokens[i] == "c" || tokens[i] == "t" || tokens[i] == "s") {
        let newValue = "";
        while (i < tokens.length && tokens[i] != "(") {
          newValue = newValue + tokens[i++];
        }
        operators.push(newValue);
        i--;
      } else if (tokens[i] == "^") {
        operators.push("^");
      }
    }
    while (operators.length > 0) {
      let getOp = operators.pop();
      if (getOp != undefined) {
        operators.push(getOp);
        if (getOp != "cos" && getOp != "sin" && getOp != "tan" && getOp != "sqrt") {
          values.push(applyOp(operators.pop(), values.pop(), values.pop()));
        } else {
          let newPushvalue = applyUnOp(operators.pop(), values.pop());
          values.push(newPushvalue);
        }
      }
    }
    if (values.length == 1)
      return values.pop();
    else
      return "Error"
  }
  catch (Exception) {
    return "Error"
  }
}
function hasPrecedence(op1, op2) {
  if (op2 == "(" || op2 == ")") {
    return false;
  }
  if ((op1 == "*" || op1 == "/") && (op2 == "+" || op2 == "-")) {
    return false;
  } else {
    return true;
  }
}
//function for binary operation
function applyOp(op, b, a) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "^":
      return Math.pow(a, b);
    case "/":
      if (b == 0) {
        return "Infinity";
      }
      return parseFloat(a / b, 10);
  }
  return "NaN";
}
//function for Uniary operation
function applyUnOp(op, b) {
  switch (op) {
    case "cos":
      return Math.cos(b);
    case "sin":
      return Math.sin(b);
    case "tan":
      return Math.tan(b);
    case "sqrt":
      return Math.sqrt(b);
  }
  return "NaN";
}
