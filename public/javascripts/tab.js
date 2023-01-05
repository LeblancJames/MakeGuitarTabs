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
        tabRow.insertBefore(newColumn, emptyArea);
        //add a span to the new column for the number of strings
        for (let i = 0; i < numStrings; i++){
            //get the first note of each string
            let tabStartNote = fretboard.children[i].firstChild.getAttributeNode('data-note').nodeValue
            let tabSpan = tools.createElement('span');
            tabSpan.innerHTML = tabStartNote;
            newColumn.appendChild(tabSpan);
        }
        let newColumn2 = tools.createElement('div');
        newColumn2.classList.add('tab-column');
        tabRow.insertBefore(newColumn2, emptyArea);
        //create the border between the tuning notes and tab
        for (let i = 0; i < numStrings; i++){
            let tabSpan = tools.createElement('span');
            tabSpan.innerHTML = '|';
            newColumn2.appendChild(tabSpan);
        }
    },
    setUpEventListeners(){
        selectedInstrumentSelector.addEventListener('change', () =>{
            tabRow.innerHTML = '<div class="empty-area"></div>',
            this.setUpTab();
        });
    },
}
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