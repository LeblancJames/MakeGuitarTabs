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


let tabRow = document.querySelector('.tab-row');


const app = {
    init() {
        this.setUpTab();
        this.setUpEventListeners();
    },
    setUpTab(){
        const emptyArea = document.querySelector('.empty-area')
        let numStrings = fretboard.childElementCount;
        let newColumn = tools.createElement('div');
        newColumn.classList.add('tab-column');
        let tabRow = document.querySelector('.tab-row');
        tabRow.insertBefore(newColumn, emptyArea);
        //add a span to the new column for the number of strings
        for (let i = 0; i < numStrings; i++){
            //get the first note of each string
            let tabStartNote = fretboard.children[i].firstChild.getAttributeNode('data-note').nodeValue
            let tabSpan = tools.createElement('span');
            tabSpan.innerHTML = tabStartNote;
            newColumn.appendChild(tabSpan);
        }
        createColumn('|', emptyArea, numStrings);
    },
    setUpEventListeners(){
        selectedInstrumentSelector.addEventListener('change', () =>{
            clearBoard();
        });
        fretboard.addEventListener('click', (event) => {
            //creates a new column
            let numStrings = fretboard.childElementCount;
            let emptyArea = document.querySelector('.empty-area')
            if (event.target.classList.contains('note-fret')){
                let newColumn = tools.createElement('div');
                newColumn.classList.add('tab-column');
                tabRow.insertBefore(newColumn, emptyArea);

                //fills column with '-' or Fret Note
                for (let i = 0; i < numStrings; i++){
                    stringNum = event.target.parentElement.getAttribute('number'); //check for string number
                    nodeValue = event.target.getAttributeNode('number').nodeValue;
                    if (i == stringNum){
                        let tabSpan = tools.createElement('span');
                        tabSpan.innerHTML = nodeValue;
                        newColumn.appendChild(tabSpan);
                    } else{
                        let tabSpan = tools.createElement('span');
                        tabSpan.innerHTML = '-';
                        newColumn.appendChild(tabSpan);
                    }
                }
                //create two empty columns
                createColumn('-', emptyArea, numStrings);
                createColumn('-', emptyArea, numStrings);
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
            const emptyArea = document.querySelector('.empty-area');
            let numStrings = fretboard.childElementCount;
            createColumn('-', emptyArea, numStrings);
        });
        createBarButton.addEventListener('click', () => {
            const emptyArea = document.querySelector('.empty-area');
            let numStrings = fretboard.childElementCount;
            createColumn('|', emptyArea, numStrings);
        });
    },
}

//save the last child and then remove until only 2 columns remain
const clearBoard = () => {
    while (tabRow.childElementCount){
        tabRow.removeChild(tabRow.lastChild);
    }
    app.setUpTab();
}
//create a new column in tabs
const createColumn = (spanContent, emptyArea, numStrings) => {
    let newColumn = tools.createElement('div');
    newColumn.classList.add('tab-column');
    tabRow.insertBefore(newColumn, emptyArea);
    for (let i = 0; i < numStrings; i++){
        let tabSpan = tools.createElement('span');
        tabSpan.innerHTML = spanContent;
        newColumn.appendChild(tabSpan);
    }
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