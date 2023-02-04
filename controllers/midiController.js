const Midi = require('../models/Midi.js');
let convertedMidi = '';

exports.wordToMidi = function(req, res){
    let midiInput = new Midi(req.body);
    let nameStrg = midiInput.data.word;
    let middleC = midiInput.data.middleC;
    let key = midiInput.data.key;
    let scale = midiInput.data.scale;
    let mode = midiInput.data.mode;
    convertedMidi = midiInput.convertToNotes(nameStrg, middleC, key, scale, mode);
    res.json(convertedMidi);
}

