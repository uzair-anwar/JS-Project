//Parser Function
function evaluate(expression) {
    let tokens = expression.split("");
    let values = [];
    let ops = [];
    for (let i = 0; i < tokens.length; i++) {
      //debugger
      console.log(tokens[i]+"Anwa")
      if (tokens[i] == " ") {
        continue;
      }
      if (tokens[i] >= "0" && tokens[i] <= "9") {
        let sbuf = "";
        while (i < tokens.length &&((tokens[i] >= "0" && tokens[i] <= "9") || tokens[i] == ".")
        ) {
          sbuf = sbuf + tokens[i++];
        }
        values.push(parseFloat(sbuf));
        i--;
      } else if (tokens[i] == "(") {
        ops.push(tokens[i]);
      } else if (tokens[i] == ")") {
        while (ops[ops.length-1] != "(") {
          values.push(applyOp(ops.pop(), values.pop(), values.pop()));
        }
        ops.pop();
        let getOp = ops.pop();
        ops.push(getOp);
        if (getOp == "cos" || getOp == "sin" || getOp == "tan" ||getOp == "sqrt") {
          let newPushvalue = applyUnOp(ops.pop(), values.pop());
          values.push(newPushvalue);
        }
      }
      else if ( tokens[i] == "+" || tokens[i] == "-" || tokens[i] == "*" || tokens[i] == "/") 
      {
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
          while (ops.length > 0 && hasPrecedence(tokens[i], ops[ops.length - 1])) 
          {
            values.push(applyOp(ops.pop(), values.pop(), values.pop()));
          }
          ops.push(tokens[i]);
        }
      } else if (tokens[i] == "c" || tokens[i] == "t" || tokens[i] == "s") {
        let newValue = "";
        while (i < tokens.length && tokens[i] != "(") {
          newValue = newValue + tokens[i++];
        }
        ops.push(newValue);
        i--;
      } else if (tokens[i] == "^") {
        ops.push("^");
      }
    }
    while (ops.length > 0) {
      let getOp = ops.pop();
      if(getOp!=undefined){
      ops.push(getOp);
      if (getOp != "cos" && getOp != "sin" && getOp != "tan" && getOp != "sqrt") {
        values.push(applyOp(ops.pop(), values.pop(), values.pop()));
      } else {
        let newPushvalue = applyUnOp(ops.pop(), values.pop());
        values.push(newPushvalue);
      }}
    }
    return values.pop();
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
console.log(evaluate("(5+2)"))