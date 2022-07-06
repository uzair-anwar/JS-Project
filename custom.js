var screen = document.querySelector('#screen');
var ans_screen = document.querySelector('#ansscreen')
var btn = document.querySelectorAll('.btn');
let history_element = document.querySelector(".memory");
let show_variables = document.querySelector(".show-var")
let historySection = document.querySelector(".var-history");
let errorSection = document.querySelector("#error");
var showError=false;
var historybtn=false;
var showvarbtn=false;
var variables=new Map();
/*============ For getting the value of btn, Here we use for loop ============*/
for (item of btn) {
    item.addEventListener('click', (e) => {
            btntext = e.target.value;
            screen.value += btntext;
            e.target.blur();
            screen.focus();
    });
}

//function for removing a element
function backspc() {
    screen.value = screen.value.substr(0, screen.value.length - 1);
}

//function for solving equation
function solve(){
    try {  
    const PI="3.1415";
    const E="2.7182";
    ans_screen.value=""
    var expression=screen.value;

    for (const [key, value] of variables) {
        let re = new RegExp(`\\b${key}\\b`, "gi");
        expression=expression.replace(key,value)  
    }
    if(expression.includes("eπ") || expression.includes("πe")){
        throw new Error("NaN")
    }
    expression=expression.replace("π",PI)
    expression=expression.replace("e",E);
    console.log(expression)
    result=evaluate(expression);
    if(result == "Infinity")
    {
        throw new Error("Infinity");
    }
    else if(result.toString()=="NaN" || result=="Error"){
        throw new Error("NaN")
    }
        
    finalResult=parseFloat(result);
    finalResult=Math.round(finalResult*10000)/10000;
    ans_screen.value=finalResult;

    history_element.innerHTML+= `
    <div><button id="${expression}" value="${finalResult}" class"historybtn" name="${expression}">
    ${expression + " = " + finalResult}
    </button>
    <button id="${expression}" name="delete">Delete</button>
    </div>`;
    } catch (Exception) {
        if(Exception.message=="Infinity")
            ans_screen.value="Second number is zero";
        else
            ans_screen.value="Expression is not valid";
    }
}

//function for creating variables
function createVar(){
    let key=document.getElementById("varkey").value;
    let targetvalue=document.getElementById("varvalue").value;
    try{
        if(!isNaN(key) && key!=""){
            throw new Error("Key can not be a Number")
        }

        else if(key=="" && targetvalue==""){
            errorSection.style.display="block";
            document.getElementById("error").value="Fields are empty"
        }
        else if(isNaN(targetvalue)){
            throw new Error("Value is not a Number")
        }
        else if (
            key.toLowerCase() == "tan" ||
            key.toLowerCase() == "cos" ||
            key.toLowerCase() == "sin" ||
            key.toLowerCase() == "sqrt" ||
            key.toLowerCase() == "pi" ||
            key.toLowerCase() == "e"
          ){
            errorSection.style.display="block";
            document.getElementById("error").value="Reserve variable cann't be declare"
          }
        else if(variables.has(key)){
            errorSection.style.display="block";
            document.getElementById("error").value="=variable is already declare"
            
        }else{
                variables.set(key,targetvalue);
                document.getElementById("varkey").value=""
                document.getElementById("varvalue").value=""
                show_variables.innerHTML+=`
                <div><button id=${key} value=${targetvalue} name="putvar">${key +" = "+targetvalue}</button>
                <button id=${key} name="deletevar">Delete</button>
                </div>`
                errorSection.style.display="block";
                document.getElementById("error").value="Variable is created successfully!";
    
        }
    } catch(Exception)
    {
        errorSection.style.display="block";
        document.getElementById("error").value=Exception.message;
    }
}

//function for showning histroy
function history(){
    if (!historybtn) {
        historySection.style.display = "block";
        historybtn = true;
      } else {
        historySection.style.display = "none";
        historybtn = false;
      }
}

//Event for Enter or backspace
screen.addEventListener("keydown", function (e) {

    if (e.code==="Enter"){
        solve();
    }
})

//Event for detele histroy or select histroy
history_element.addEventListener("click",(event)=>{
    const TARGET_BTN=event.target;
    if(TARGET_BTN.name=="delete"){
        let target = document.getElementById(TARGET_BTN.id);
        target.parentElement.remove();
    } else {
        screen.value=TARGET_BTN.id;
        ans_screen.value=TARGET_BTN.value
        
    }
})

//Event for detele variable or select value of variable
show_variables.addEventListener('click',(event)=>{
    const TARGET_BTN=event.target;
    if(TARGET_BTN.name=="deletevar"){
        let target=document.getElementById(TARGET_BTN.id);
        let targetvalue=document.getElementById(TARGET_BTN.id).value;
        variables.delete(targetvalue)
        target.parentElement.remove();
    }else if(TARGET_BTN.name=="putvar"){
        screen.value+=TARGET_BTN.id;
    }
})


//function for show variables
function showVar(){
    if(!showvarbtn){
        show_variables.style.display="block";
        showvarbtn=true;
    }else {
        show_variables.style.display="none";
        showvarbtn=false;
    }
}

//function for Error display
function showErrorInput(){
    errorSection.style.display="none";
}
