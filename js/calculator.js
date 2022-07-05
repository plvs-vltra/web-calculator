const HTML_controlls = [...document.querySelectorAll("[data-button-type]")],
      controlls = HTML_controlls.map(html_button => {
        return {
            body: html_button,
            value: html_button.innerHTML,
            type: html_button.getAttribute("data-button-type")
        }
      });



let buffer = [{
    value: 0,
    type: "operand"
}], keyup = false;



function getBufferLastItem(){
    return buffer[buffer.length - 1];
}



function getBufferLastOperand(){
    let n = buffer[buffer.length - 1].type == "operand" ? 1 : 2;
    return buffer[buffer.length - n]
}



function addToBuffer(button){
    let lastItem = buffer.length > 0 ? buffer[buffer.length - 1] : false;


    if(lastItem.type == button.type){
        buffer[buffer.length - 1] = button.type == "operator" ? 
            button : {
                type: "operand", 
                value: lastItem.value == 0 ? 
                    button.value : (lastItem.value + button.value)
                }
    } else {
        if(button.type == "operator") {
            if(buffer.length > 0) buffer.push(button);
        } else {
            buffer.push(button);
        }
    }
}


function calculate(){
    let operand_b = Number(buffer[buffer.length - 1].value),
        operator = buffer[buffer.length - 2].value,
        operand_a = Number(buffer[buffer.length - 3].value),
        result = 0;

    if(operator == "+") result = operand_a + operand_b;
    if(operator == "-") result = operand_a - operand_b;
    if(operator == "x") result = operand_a * operand_b;
    if(operator == "/") result = operand_a / operand_b;

    if(operator == "+" || operator == "-" || operator == "x" || operator == "/"){
        addToBuffer({
            value: "=",
            type: "operator",
        });

        addToBuffer({
            value: result,
            type: "operand",
        });
    }

    return result;  
}



function detectClick(button){

    if(button.value == "C"){
        buffer = [{
            value: 0,
            type: "operand"
        }];

        showOnDisplay("0");
    } else if(button.value == "=" || button.value == "+" || button.value == "-" || button.value == "x" || button.value == "/"){
        if(buffer.length >= 3 && getBufferLastItem().type == "operand") showOnDisplay(calculate())
        addToBuffer(button);
    } else if(button.value == "+/-"){
        buffer[buffer.length - 1].value = Number(getBufferLastOperand().value) * -1;
        showOnDisplay(getBufferLastOperand().value);
    } else if(button.value == "√"){
        addToBuffer(button);
        addToBuffer({
            value: Math.sqrt(getBufferLastOperand().value),
            type:"operand"
        });

        showOnDisplay(getBufferLastOperand().value);
    } else if(button.value == "."){
        
    } else {
        addToBuffer(button);
        showOnDisplay(getBufferLastOperand().value);
    }
}

function createBufferOperator(value){
    return {
        value: value,
        type: "operator"
    }
}

function createBufferOperand(value){
    return {
        value: value,
        type: "operand"
    }
}


function isAllowedKey(key){
    let result = false;

    if(key == "0" || key == "1" ||  key == "2" ||  key == "3" || 
       key == "4" ||  key == "5" ||  key == "6" ||  key == "7" || 
       key == "8" ||  key == "9" ||  key == "+" ||  key == "-" || 
       key == "*" ||  key == "/" ||  key == "Enter" || key == "Backspace"
       ) result = true;

    return result;
}


function detectPress(key){
    if(isAllowedKey(key.key)){
        let code = key.key;

        if(key.key == "Enter") code = "=";
        if(key.key == "*") code = "x";

        if(code == "=" || code == "+" || code == "-" || code == "x" || code == "/"){
            console.log(code)
            if(buffer.length >= 3 && getBufferLastItem().type == "operand") showOnDisplay(calculate())
            addToBuffer(createBufferOperator(code));
        } else if(key == "."){
            
        } else if(key.keyCode == 8){
            buffer = [{
                value: 0,
                type: "operand"
            }];
    
            showOnDisplay("0");
        }else {
            let a = createBufferOperand(key.key);

            console.log(a, code, key)
            addToBuffer(a);
            showOnDisplay(getBufferLastOperand().value);
        }
    }

}



function showOnDisplay(content){        
    document.getElementById("display").innerHTML = content;
}



controlls.forEach(button => {
    button.body.addEventListener("click", (key) => {
        detectClick(button);
        
        console.log(buffer);
    });

    if(!keyup){
        document.addEventListener("keyup", (event) => {
            detectPress(event);

            console.log(event)
            console.log(buffer);
        });

        keyup = true;
    }
});