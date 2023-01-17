const Midi = require('../models/Midi.js');
let convertedMidi = '';

exports.wordToMidi = function(req, res){
    let midiInput = new Midi(req.body);
    let nameStrg = midiInput.data.input;
    convertedMidi = midiInput.convertToNotes(nameStrg);
    res.json(convertedMidi);
}

