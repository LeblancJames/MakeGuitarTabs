const widthOfWindow = window.innerWidth;

const clearBoardButton = document.querySelector('#clear-board-button');
const removePreviousButton = document.querySelector('#remove-previous-button');
const createEmptyColumnButton = document.querySelector('#create-empty-column-button');
const createBarButton = document.querySelector('#create-bar-button');
const newRowButton = document.querySelector('#new-row-button');


const tabContainer = document.querySelector('#tab-container')
const fretboard = document.querySelector('.fretboard');
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
            newColumn.appendChild(tabSpan);
        }

        //creates second column that seperates tuning notes from tabs itself
        createColumn('|', numStrings);
    },
    setUpEventListeners(){
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
                nodeValue = event.target.getAttributeNode('number').nodeValue;
                if (i == stringNum){
                    let tabSpan = tools.createElement('span', nodeValue);
                    tabSpan.classList.add('tabSpan');
                    newColumn.appendChild(tabSpan);
                } else{
                    let tabSpan = tools.createElement('span', '-');
                    tabSpan.classList.add('tabSpan');
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

        //number press
        document.addEventListener("keypress", (event) => {
            if ((isFinite(event.key)) && (event.key != ' ')) {
                tabRow = document.querySelector('#tab-container').lastElementChild;
                let numStrings = fretboard.childElementCount;
                let newColumn = tools.createElement('div');
                newColumn.classList.add('tab-column');
                tabRow.insertBefore(newColumn, emptyArea);
                //fills column with '-' or Fret Note
                for (let i = 0; i < numStrings; i++){
                    if (i == inputString){
                        let tabSpan = tools.createElement('span', event.key);
                        tabSpan.classList.add('tabSpan');
                        newColumn.appendChild(tabSpan);
                    } else{
                        let tabSpan = tools.createElement('span', '-');
                        tabSpan.classList.add('tabSpan');
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
        //special characters 
        document.addEventListener("keypress", (event) => {
            if (!event.getModifierState("CapsLock")) {
                if (event.key == '/'){
                    deleteColumn();
                    deleteColumn();
                    createColumn('-', numStrings,'/');
                }
            }
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
    let newColumn = tools.createElement('div');
    newColumn.classList.add('tab-column');
    tabRow.insertBefore(newColumn, emptyArea);
    for (let i = 0; i < numStrings; i++){
        let tabSpan = tools.createElement('span', spanContent);
        tabSpan.classList.add('tabSpan');
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
    } else {
        alert('No notes left to remove');
    }
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

app.init();