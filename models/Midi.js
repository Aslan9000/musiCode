const MidiWriter = require('midi-writer-js');

let Midi = function(data){
	this.data = data;
	this.errors = [];
}

Midi.prototype.convertToNotes = function(nameStrg){
	const alphaMidiCode= {
		A: 48,
		B: 50,
		C: 52,
		D: 53,
		E: 55,
		F: 57,
		G: 59,
		H: 60,
		I: 62,
		J: 64,
		K: 65,
		L: 67,
		M: 69,
		N: 71,
		O: 72,
		P: 74,
		Q: 76,
		R: 77,
		S: 79,
		T: 81,
		U: 83,
		V: 84,
		W: 86,
		X: 88,
		Y: 89,
		Z: 91
	}
	
	// Start with a new track
	const track2 = new MidiWriter.Track();
	
	// Add some notes:
	let pitch = [];

	let nameArry = nameStrg.split('');

	for(let letter of nameArry){
		let upLet = letter.toUpperCase();
		pitch.push(alphaMidiCode[upLet]);
	}
	const note = new MidiWriter.NoteEvent({pitch: pitch, duration: '4', sequential: true, repeat: 2 });
	track2.addEvent(note);

	// Generate a data URI
	const write = new MidiWriter.Writer(track2);
	let converted = write.dataUri();
	return converted;
}


module.exports = Midi;

