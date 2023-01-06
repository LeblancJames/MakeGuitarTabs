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

let emptyArea = document.querySelector('.empty-area:last-child')
let tabRow = document.querySelector('.tab-row:last-child');



const app = {
    init() {
        console.log(widthOfWindow);
        this.setUpTab(emptyArea, tabRow);
        this.setUpEventListeners();
    },
    setUpTab(emptyArea, tabRow){
        let numStrings = fretboard.childElementCount;
        let newColumn = tools.createElement('div');
        newColumn.classList.add('tab-column');
        tabRow.insertBefore(newColumn, emptyArea);
        //add a span to the new column for the number of strings to create first column 
        for (let i = 0; i < numStrings; i++){
            //get the first note of each string
            let tabStartNote = fretboard.children[i].firstChild.getAttributeNode('data-note').nodeValue
            let tabSpan = tools.createElement('span', tabStartNote);
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
            let tabRow = document.querySelector('.tab-row:last-child');
            let numStrings = fretboard.childElementCount;
            if (event.target.classList.contains('note-fret')){
                let newColumn = tools.createElement('div');
                newColumn.classList.add('tab-column');
                tabRow.insertBefore(newColumn, emptyArea);

                //fills column with '-' or Fret Note
                for (let i = 0; i < numStrings; i++){
                    stringNum = event.target.parentElement.getAttribute('number'); //check for string number
                    nodeValue = event.target.getAttributeNode('number').nodeValue;
                    if (i == stringNum){
                        let tabSpan = tools.createElement('span', nodeValue);
                        newColumn.appendChild(tabSpan);
                    } else{
                        let tabSpan = tools.createElement('span', '-');
                        newColumn.appendChild(tabSpan);
                    }
                }
                //create two empty columns
                createColumn('-', numStrings);
                createColumn('-', numStrings);

                // let isOverflowing = tabRow.clientWidth < tabRow.scrollWidth;
                // if(isOverflowing){
                //     createNewRow();
                // }
                
            }
        });
        clearBoardButton.addEventListener('click', () => {
            clearBoard();
        });
        removePreviousButton.addEventListener('click', () => {
            if (tabRow.childElementCount > 2) {
                tabRow.removeChild(tabRow.lastChild);
            } else {
                alert('No notes left to remove');
            }
        });
        createEmptyColumnButton.addEventListener('click', () => {
            let numStrings = fretboard.childElementCount;
            createColumn('-', numStrings);
        });
        createBarButton.addEventListener('click', () => {
            let numStrings = fretboard.childElementCount;
            createColumn('|', numStrings);
        });
        newRowButton.addEventListener('click', () => {
            createNewRow()
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
const createColumn = (spanContent, numStrings) => {
    emptyArea = document.querySelector('.empty-area:last-child')
    tabRow = document.querySelector('.tab-row:last-child');
    let newColumn = tools.createElement('div');
    newColumn.classList.add('tab-column');
    tabRow.insertBefore(newColumn, emptyArea);
    for (let i = 0; i < numStrings; i++){
        let tabSpan = tools.createElement('span', spanContent);
        newColumn.appendChild(tabSpan);
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
    emptyArea = document.querySelector('.empty-area:last-child')
    tabRow = document.querySelector('.tab-row:last-child');
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