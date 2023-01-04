
const root = document.documentElement;

const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const guitarTuning = [4, 11, 7, 2, 9, 4];
let accidentals = 'flats';


const fretboard = document.querySelector('.fretboard');
const numberOfFrets = 12;
const numberOfStrings = 6;

const singleFretMarkPositions = [3, 5, 7, 9, 15, 19, 21];
const doubleFretMarkPositions = [12, 24]; 

const app = {
    init()  {
        this.setUpFretboard();
    },
    setUpFretboard(){
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

                let noteName = this.generateNoteNames((fret + guitarTuning[i]), accidentals)
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
    },

    generateNoteNames(noteIndex, accidentals){
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats'){
            return noteName = notesFlat[noteIndex];
        }else if(accidentals === 'sharps'){
            return noteName = notesSharp[noteIndex];
        }
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