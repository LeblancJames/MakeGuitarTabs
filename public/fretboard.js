//home page controls
(function() {

    const root = document.documentElement;
    const fretboard = document.querySelector('.fretboard');
    const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    
    //variables for changing instrument notes on fretboard
    const selectedInstrumentSelector = document.querySelector('#instrument-selector');
    let selectedInstrument = 'Guitar';
    const instrumentTuningPresets = {
        'Guitar': [4, 11, 7, 2, 9, 4],
        'Bass (4 string)': [7, 2, 9, 4],
        'Bass (5 string)': [7, 2, 9, 4, 11],
        'Ukelele': [9, 4, 0, 7],
    }
    let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
    
    //change accidental (flats or sharps)
    const selectedAccidental = document.querySelector('#accidental-selector');
    let accidentals = 'Flats';
    const accidentalsList = ['Flats', 'Sharps']
    
    //change fret number
    const selectedFretNumber = document.querySelector('#fret-number-selector');
    let numberOfFrets = 12;
    const fretNumberList = [12, 16, 20, 24];
    
    const singleFretMarkPositions = [3, 5, 7, 9, 15, 19, 21];
    const doubleFretMarkPositions = [12, 24]; 

    //show notes switches
    const showAllNotesSwitch = document.querySelector('#show-all-notes');
    const showSameNotesSwitch = document.querySelector('#show-same-notes');
    

    
    const app = {
        init()  {
            this.setUpInstrumentSelector();
            this.setUpAccidentalSelector();
            this.setUpFretboard();
            this.setUpEventListeners();
            this.setUpFretNumberSelector();
        },
        //creates dropdown menu for selecting instrument
        setUpInstrumentSelector(){
            for(instrument in instrumentTuningPresets){
                let instrumentOption = tools.createElement('option', instrument);
                selectedInstrumentSelector.appendChild(instrumentOption);
            }
        },
        //create dropdown menu for accidentals
        setUpAccidentalSelector(){
            for(accidental of accidentalsList){
                let accidentalOption = tools.createElement('option', accidental);
                selectedAccidental.appendChild(accidentalOption);
            }  
        },
        //create dropdown menu for number of frets
        setUpFretNumberSelector(){
            for(fretNumber of fretNumberList){
                let fretNumberOption = tools.createElement('option', fretNumber);
                selectedFretNumber.appendChild(fretNumberOption);
            }
        },
        setUpFretboard(){
            fretboard.innerHTML = '';
            root.style.setProperty('--number-of-strings', numberOfStrings);
            //add strings
            for (let i = 0; i < numberOfStrings; i++){
                let string = tools.createElement('div');
                string.classList.add('string');
                fretboard.appendChild(string);
    
                //create frets
                for (let fret = 0; fret <= numberOfFrets; fret++){
                    let noteFret = tools.createElement('div');
                    noteFret.classList.add('note-fret');
                    string.appendChild(noteFret); 
                    
                    let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals)
                    noteFret.setAttribute('data-note', noteName);
                    
                    //add fret marks
                    if(i === 0 && singleFretMarkPositions.indexOf(fret) !== -1){
                        noteFret.classList.add('single-fretmark');
                    } else if(i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1){
                        let doubleFretMark = tools.createElement('div');
                        doubleFretMark.classList.add('double-fretmark');
                        noteFret.appendChild(doubleFretMark);
                    }
    
    
                }
            }
            allNotes = document.querySelectorAll('.note-fret');
    
        },
        //create names for notes
        generateNoteNames(noteIndex, accidentals){
            noteIndex = noteIndex % 12;
            let noteName;
            if (accidentals === 'Sharps'){
                return noteName = notesSharp[noteIndex];
            }else{
                return noteName = notesFlat[noteIndex];
            }
        },
        //show fret note upon mouse hover
        showNoteDot(event){
            if (event.target.classList.contains('note-fret')){
                if (showSameNotesSwitch.checked){
                    app.toggleMultipleNotes(event.target.dataset.note, 1)
                }
                else{event.target.style.setProperty('--noteDotOpacity', 1);
                }
            }
        },
        //hide fret note upon mouse leave
        hideNoteDot(event){
            if (showSameNotesSwitch.checked){
                app.toggleMultipleNotes(event.target.dataset.note, 0)
            }
            else {event.target.style.setProperty('--noteDotOpacity', 0);
            }
        },
        setUpEventListeners(){
             //listens for selecting instrument
             selectedInstrumentSelector.addEventListener('change', (event) => {
                selectedInstrument = event.target.value;
                numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
                this.setUpFretboard();
            });
            //listen for accidental change
            selectedAccidental.addEventListener('change', (event) =>{
                accidentals = event.target.value;
                this.setUpFretboard();
            });
             //listen for fret number change
             selectedFretNumber.addEventListener('change', (event) =>{
                numberOfFrets = event.target.value;
                this.setUpFretboard();
            });
            //create listener for showing fret note upon hovering over with mouse
            fretboard.addEventListener('mouseover', this.showNoteDot);
            fretboard.addEventListener('mouseout', this.hideNoteDot);
              
            showAllNotesSwitch.addEventListener('change', () => {
                if (showAllNotesSwitch.checked){
                    root.style.setProperty('--noteDotOpacity', 1);
                    fretboard.removeEventListener('mouseover', this.showNoteDot);
                    fretboard.removeEventListener('mouseout', this.hideNoteDot);
                }else{
                    root.style.setProperty('--noteDotOpacity', 0);
                    fretboard.addEventListener('mouseover', this.showNoteDot);
                    fretboard.addEventListener('mouseout', this.hideNoteDot);
                }
                this.setUpFretboard();
            });
        },
        //allows for the same note to be shown upon hovering
        toggleMultipleNotes(noteName, opacity) {
                for (let i = 0; i < allNotes.length; i++){
                    if(allNotes[i].dataset.note === noteName){
                        allNotes[i].style.setProperty('--noteDotOpacity', opacity);
                }
            }
        },
    }
    //helps create elements
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
})();
