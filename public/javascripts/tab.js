const widthOfWindow = window.innerWidth;

let dropDownMenu = document.querySelector('.dropdown-menu');
let container = document.querySelectorAll('.container');

let tabContainer = document.querySelector('#tab-container')
let fretboard = document.querySelector('.fretboard');
const selectedInstrumentSelector = document.querySelector('#instrument-selector');
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 string)': [7, 2, 9, 4],
    'Bass (5 string)': [7, 2, 9, 4, 11],
    'Ukelele': [9, 4, 0, 7],
}


let tabRow = document.querySelector('#tab-container').lastElementChild;
let emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild;
let newColumn;
let numStrings;

let inputString = 0; //string that the fret note will be on

const app = {
    init() {
        fretboardFunction();
        this.setUpTab(emptyArea, tabRow);
        this.setUpEventListeners();
     
        
    },

    setUpTab(emptyArea, tabRow){
        numStrings = fretboard.childElementCount;
        newColumn = tools.createElement('div');
        newColumn.classList.add('tab-column');
        tabRow.insertBefore(newColumn, emptyArea);
        //add a span to the new column for the number of strings to create first column 
        for (let i = 0; i < numStrings; i++){
            //get the first note of each string
            let tabStartNote = fretboard.children[i].firstChild.getAttributeNode('data-note').nodeValue
            let tabSpan = tools.createElement('span', tabStartNote);
            tabSpan.classList.add('tabSpan');
            tabSpan.setAttribute('contenteditable', "plaintext-only");
            newColumn.appendChild(tabSpan);
        }

        //creates second column that seperates tuning notes from tabs itself
        createColumn('|', numStrings);
        colorInputString();

    },
    setUpEventListeners(){
        document.querySelector("#print-content-button").addEventListener('click', () =>{
            printContent('tab-container');
        })
        let clearBoardButton = document.querySelector('#clear-board-button');
        let removePreviousButton = document.querySelector('#remove-previous-button');
        let createEmptyColumnButton = document.querySelector('#create-empty-column-button');
        let createBarButton = document.querySelector('#create-bar-button');
        let newRowButton = document.querySelector('#new-row-button');
        fretboard = document.querySelector('.fretboard');
        selectedInstrumentSelector.addEventListener('change', () =>{
            clearBoard();
        });
        fretboard.addEventListener('click', (event) => {
            //creates a new column
            tabRow = document.querySelector('#tab-container').lastElementChild;

            if (event.target.classList.contains('note-fret')){
                let newColumn = tools.createElement('div');
                newColumn.classList.add('tab-column');
                tabRow.insertBefore(newColumn, emptyArea);

            //fills column with '-' or Fret Note
            for (let i = 0; i < numStrings; i++){
                stringNum = event.target.parentElement.getAttribute('number'); //check for string number
                inputString = stringNum;
                colorInputString();
                nodeValue = event.target.getAttributeNode('number').nodeValue;
                if (i == stringNum){
                    let tabSpan = tools.createElement('span', nodeValue);
                    tabSpan.classList.add('tabSpan');
                    tabSpan.setAttribute('contenteditable', "plaintext-only");
                    newColumn.appendChild(tabSpan);
                } else{
                    let tabSpan = tools.createElement('span', '-');
                    tabSpan.classList.add('tabSpan');
                    tabSpan.setAttribute('contenteditable', "plaintext-only");
                    newColumn.appendChild(tabSpan);
                }
            }
            //create two empty columns if caps is on
            if (!event.getModifierState("CapsLock")) {
                createColumn('-', numStrings);
                createColumn('-', numStrings);
            }
            //check if tab is past appropriate size and entering instructions container
            let isOverflowing = tabRow.clientWidth < tabRow.scrollWidth;
                if(isOverflowing){
                    createNewRow();
                }
                
            }
        });
        clearBoardButton.addEventListener('click', () => {
            clearBoard();
        });
        removePreviousButton.addEventListener('click', () => {
           deleteColumn();
        });
        createEmptyColumnButton.addEventListener('click', () => {
            tabRow = document.querySelector('#tab-container').lastElementChild;
            emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild;
            let numStrings = fretboard.childElementCount;
            createColumn('-', numStrings);
        });
        createBarButton.addEventListener('click', () => {
            tabRow = document.querySelector('#tab-container').lastElementChild;
            emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild;
            let numStrings = fretboard.childElementCount;
            createColumn('|', numStrings);
        });
        newRowButton.addEventListener('click', () => {
            createNewRow()
        });
        //keydown event listeners 
        document.addEventListener("keydown", keyDownEvents);

        tabContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('tabSpan')){
                let container = event.target;
                document.removeEventListener('keydown', keyDownEvents);
                document.addEventListener('keydown', (event) =>{
                    if (event.key === 'Enter' || !event.target.classList.contains('tabSpan')){
                        document.addEventListener("keydown", keyDownEvents);
                        container.blur();
                    } 
                });           
            }
        });
        dropDownMenu.addEventListener('click', (event) => {
            if (event.target.classList.contains('form-control')){
                document.removeEventListener('keydown', keyDownEvents);
            }
        });
        document.addEventListener('keydown', (event) =>{
            if (event.key === 'Escape'){
                document.addEventListener("keydown", keyDownEvents);
            };
        }); 
    },
}

//save the last child and then remove until only 2 columns remain
const clearBoard = () => {
    while(tabContainer.childElementCount > 0){
        tabContainer.removeChild(tabContainer.lastChild);
    }
    createNewRow();
}
//create a new column in tabs
const createColumn = function(spanContent, numStrings, differentValue) {
    tabRow = document.querySelector('#tab-container').lastElementChild;
    emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild; 
    newColumn = tools.createElement('div');
    newColumn.classList.add('tab-column');
    tabRow.insertBefore(newColumn, emptyArea);
    for (let i = 0; i < numStrings; i++){
        let tabSpan = tools.createElement('span', spanContent);
        tabSpan.classList.add('tabSpan');
        tabSpan.setAttribute('contenteditable', "plaintext-only");
        newColumn.appendChild(tabSpan);
    }
    if (arguments.length > 2){
        newColumn.children[inputString].textContent = differentValue;
    }
}

//delete column
const deleteColumn = () => {
    tabRow = document.querySelector('#tab-container').lastElementChild;
    if (tabRow.childElementCount > 3) {
        tabRow.removeChild(tabRow.lastElementChild.previousElementSibling);
    } else if(tabContainer.childElementCount > 1){       
        tabContainer.removeChild(tabContainer.lastElementChild);     
    } 
    tabRow = document.querySelector('#tab-container').lastElementChild;
    emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild; 
}
//create a new row
const createNewRow = () => {
    let nextRow = tools.createElement('div');
    nextRow.classList.add('tab-row');
    nextRow.classList.add('d-flex');
    let nextEmptyArea = tools.createElement('div');
    nextEmptyArea.classList.add('empty-area');
    nextRow.appendChild(nextEmptyArea);
    tabContainer.appendChild(nextRow);
    tabRow = document.querySelector('#tab-container').lastElementChild;
    emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild;
    app.setUpTab(emptyArea, tabRow);
}

//create special key
const createspecialKey = (numStrings, specialKeyValue) => {
    deleteColumn();
    deleteColumn();
    createColumn('-', numStrings, specialKeyValue);
}

//color input string 
const colorInputString = () => {
    //remove colors from all strings
    let checkColoredStrings = document.querySelector('#tab-container').lastElementChild.firstElementChild;
    for (i = 0; i < numStrings; i++){
        checkColoredStrings.children[i].classList.remove('color-this-string');
    }
    //add color to current input string
    let colorThisString = checkColoredStrings.children[inputString];
    colorThisString.classList.add('color-this-string')
}
//helps create element
const tools = {
    createElement(element, content){
        element = document.createElement(element);
        if (arguments.length > 1 ){
            element.innerHTML = content;
        }
        return element;
    }
}
function keyDownEvents (event) {
    if ((isFinite(event.key)) && (event.key != ' ')) {
        tabRow = document.querySelector('#tab-container').lastElementChild;
        numStrings = fretboard.childElementCount;
        newColumn = tools.createElement('div');
        newColumn.classList.add('tab-column');
        tabRow.insertBefore(newColumn, emptyArea);
        //fills column with '-' or Fret Note
        for (let i = 0; i < numStrings; i++){
            if (i == inputString){
                let tabSpan = tools.createElement('span', event.key);
                tabSpan.classList.add('tabSpan');
                tabSpan.setAttribute('contenteditable', "plaintext-only");
                newColumn.appendChild(tabSpan);
            } else{
                let tabSpan = tools.createElement('span', '-');
                tabSpan.classList.add('tabSpan');
                tabSpan.setAttribute('contenteditable', "plaintext-only");
                newColumn.appendChild(tabSpan);
            }
        }
        //create two empty columns if caps is on
        if (!event.getModifierState("CapsLock")) {
            createColumn('-', numStrings);
            createColumn('-', numStrings);
        }
        //check if tab is past appropriate size and entering instructions container
        let isOverflowing = tabRow.clientWidth < tabRow.scrollWidth;
            if(isOverflowing){
                createNewRow();
            }
            
    }

    //special characters 
    if (!event.getModifierState("CapsLock")) {
        if (event.key == '/'){createspecialKey(numStrings, '/')}
        if (event.key == 'H'){createspecialKey(numStrings, 'H')}
        if (event.key == 'h'){createspecialKey(numStrings, 'h')}
        if (event.key == 'P'){createspecialKey(numStrings, 'P')}
        if (event.key == 'p'){createspecialKey(numStrings, 'p')}
        if (event.key == 'B'){createspecialKey(numStrings, 'B')}
        if (event.key == 'b'){createspecialKey(numStrings, 'b')}
        if (event.key == 'R'){createspecialKey(numStrings, 'R')}
        if (event.key == 'r'){createspecialKey(numStrings, 'r')}
    
        if (event.key == 'V'){createspecialKey(numStrings, 'V'), createColumn('-', numStrings),createColumn('-', numStrings)}
        if (event.key == 'v'){createspecialKey(numStrings, 'v'), createColumn('-', numStrings),createColumn('-', numStrings)}
    } 
    if (event.getModifierState("CapsLock")) {
        if (event.key == '/'){createColumn('-',numStrings, '/')}
        if (event.key == 'H'){createColumn('-',numStrings, 'h')}
        if (event.key == 'P'){createColumn('-',numStrings, 'p')}
        if (event.key == 'B'){createColumn('-',numStrings, 'b')}
        if (event.key == 'R'){createColumn('-',numStrings, 'r')}
        if (event.key == 'V'){createColumn('-',numStrings, 'v')}


        if (event.key == 'H' && event.shiftKey){deleteColumn(),createColumn('-',numStrings, 'H')}
        if (event.key == 'P' && event.shiftKey){deleteColumn(),createColumn('-',numStrings, 'P')}
        if (event.key == 'B' && event.shiftKey){deleteColumn(),createColumn('-',numStrings, 'B')}
        if (event.key == 'R' && event.shiftKey){deleteColumn(),createColumn('-',numStrings, 'R')}
        if (event.key == 'V' && event.shiftKey){deleteColumn(),createColumn('-',numStrings, 'V')}
    }

    if (event.key == 'x' || event.key == 'X'){createColumn('-', numStrings, 'x')}
    if (event.key == '|'){createColumn('|', numStrings)}

    
    if (event.key == ' '){createColumn('-', numStrings), event.preventDefault()}
    if (event.key === 'Backspace'){deleteColumn()}
    if (event.key === 'Enter'){createNewRow()}

    if(event.key == 'w' || event.key == 'W'){
        if (inputString === 0){
            inputString = (fretboard.childElementCount-1);
        } else {
            inputString -= 1;
        }
        colorInputString();

    }
    if(event.key == 's' || event.key == 'S'){
        if (inputString === (fretboard.childElementCount-1)){
            inputString = 0;
        } else {
            inputString ++;
        }
        colorInputString();

    }
};

app.init();


//export function
function printContent(el){ 

    let restorePage = document.body.innerHTML;
    let printContent = document.getElementById(el).innerHTML;
    document.body.innerHTML = printContent;
    const rows = document.querySelectorAll('.tab-row');
    //remove the tuning notes
    for (let i = 0; i < rows.length; i++){
        rows[i].firstElementChild.remove();
        // rows[i].children[1].remove();
    }

    window.print();
    document.body.innerHTML = restorePage; 
    tabContainer = document.querySelector('#tab-container')
    tabRow = document.querySelector('#tab-container').lastElementChild;
    emptyArea = document.querySelector('#tab-container').lastElementChild.lastElementChild;
    app.setUpEventListeners();
    fretboardFunction();
    document.querySelector("#save-tab-button").addEventListener('click', (event) =>{
        const userId = event.target.getAttribute('data-userid');
        saveTab('tab-container', userId);
    })
    function saveTab(el, userId){
            let saveTabContainer = document.getElementById(el);  //get tab container 
            let innerHTMLTabContainer = saveTabContainer.innerHTML; //get contents of tab container
            if(userId.length === 0){
                document.querySelector("#please-login-alert").classList.remove('d-none');
                setTimeout(function(){
                    document.querySelector("#please-login-alert").classList.add('d-none');
                }, 2000);
                clearTimeout(timeoutId)
    
            } else {
                fetch('/saveTab', {   
                    method: 'POST',
                    body: JSON.stringify({ userId: userId, tabs: innerHTMLTabContainer}),
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                document.querySelector("#successful-save-alert").classList.remove('d-none');
                setTimeout(function(){
                    document.querySelector("#successful-save-alert").classList.add('d-none');
                }, 2000);
                clearTimeout(timeoutId)}
    }
}

