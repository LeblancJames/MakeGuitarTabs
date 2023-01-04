const {fretboard} = require('../models/fretboard');
const notesFlat = fretboard.notesFlat;
const notesSharp = fretboard.notesSharp;


module.exports.accidentals = 'flats';

//determine Note
module.exports.generateNoteNames = (noteIndex, accidentals) => {
    noteIndex = noteIndex % 12;
    let noteName; 
    if (accidentals === 'flats'){
        return noteName = notesFlat[noteIndex];
    } else if (accidentals === 'sharps') {
        return noteName = notesSharp[noteIndex];
    }
}



