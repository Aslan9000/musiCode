const MidiWriter = require('midi-writer-js');

let Midi = function(data){
	this.data = data;
	this.errors = [];
}

Midi.prototype.convertToNotes = function(nameStrg, middleC, key, scale, mode){
	// if middle C is C3 octave range -2 to 8
	// if middle C is C4 octave range -1 to 9
	// default is C major
	let alphaMidiFinal= {
		A: 48, B: 50, C: 52, D: 53, E: 55, F: 57, G: 59,
		H: 60, I: 62, J: 64, K: 65, L: 67, M: 69, N: 71,
		O: 72, P: 74, Q: 76, R: 77, S: 79, T: 81, U: 83,
		V: 84, W: 86, X: 88, Y: 89,Z: 91
	}

	const midNoteMap = [
		// C [0]
		[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
		// C#/Db [1]
		[1, 13, 25, 37, 49, 61, 73, 85, 97, 109, 121], 
		// D [2]
		[2, 14, 26, 38, 50, 62, 74, 86, 98, 110, 122],
		// D#Eb [3]
		[3, 15, 27, 39, 51, 63, 75, 87, 99, 111, 123],
		// E [4]
		[4, 16, 28, 40, 52, 64, 76, 88, 100, 112, 124],
		// F [5]
		[5, 17, 29, 41, 53, 65, 77, 89, 101, 113, 125],
		// F#/Gb [6]
		[6, 18, 30, 42, 54, 66, 78, 90, 102, 114, 126],
		// G [7]
		[7, 19, 31, 43, 55, 67, 79, 91, 103, 115, 127],
		// G#/Ab [8]
		[8, 20, 32, 44, 56, 68, 80, 92, 104, 116],
		// A [9]
		[9, 21, 33, 45, 57, 69, 81, 93, 105, 117],
		// A#/Bb [10]
		[10, 22, 34, 46, 58, 70, 82, 94, 106, 118],
		// B [11]
		[11, 23, 35, 47, 59, 71, 83, 95, 107, 119]
	]


	// create an array for midi numbers 0-127
	let midNumbers = [];

	// select middle C
	let midC = 4

	if(middleC === "C3"){
		midC = 3
	}else{
		midC = 4
	}

	// select a key (in midi number form)

	const keys = {"C": 0, "C#/Db": 1, "D": 2, "D#/Eb": 3, "E": 4, "F": 5, "F#/Gb": 6, "G": 7, "G#/Ab": 8, "A": 9, "A#/Bb": 10, "B": 11};

	let keyIndex = midNoteMap[keys[key]][midC];
	for(let i=keyIndex; i< 128; i++){
		midNumbers.push(i);
	}
	
	/* assigns the same midi numbers to some of the letters so that everything fits within one or two octaves instead of wildly dramatic dynamics of sound in a short piece */
	let octaveWrap = true;
	if(octaveWrap === true){
		for(let i=0; i < midNumbers.length; i++){
			midNumbers[i] = (midNumbers[i] % 12)+keyIndex;
		}	
	}
	// create array of midi numbers fitting scale/mode pattern within length needed to map entire alphabet
	let alphaMidCode = [];

	// if user chooses a mode, let switch statement expression evaluate mode input instead of scale
	if(mode != "Ionian"){
		scale = mode;
	}

	/* If a major scale is selected, a mode selection should appear. If a mode is selected send the mode selection to the scale switch statement */
	// if whole-tone scale is selected, disable all key options except for C and Db
	switch(scale){
		case "Chromatic":
			for(let i=0; i<26; i++){
				alphaMidCode.push(midNumbers[0]);
				midNumbers = midNumbers.slice(1, -1);
			}
			break;
		case "Whole-Tone":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[0], midNumbers[2], midNumbers[4], midNumbers[6], midNumbers[8], midNumbers[10]);
				midNumbers = midNumbers.slice(12, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Major":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[0], midNumbers[2], midNumbers[4], midNumbers[5], midNumbers[7], midNumbers[9], midNumbers[11]);
				midNumbers = midNumbers.slice(12, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Minor":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[0], midNumbers[2], midNumbers[3], midNumbers[5], midNumbers[7], midNumbers[8], midNumbers[10]);
				midNumbers = midNumbers.slice(12, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Major Pentatonic":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[0], midNumbers[2], midNumbers[4], midNumbers[7], midNumbers[9]);
				midNumbers = midNumbers.slice(12, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Minor Pentatonic":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[0], midNumbers[3], midNumbers[5], midNumbers[7], midNumbers[10]);
				midNumbers = midNumbers.slice(12, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		// ionian is the same as C major scale
		case "Dorian":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[2], midNumbers[4], midNumbers[5], midNumbers[7], midNumbers[9], midNumbers[11], midNumbers[12]);
				midNumbers = midNumbers.slice(13, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Phrygian":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[4], midNumbers[5], midNumbers[7], midNumbers[9], midNumbers[11], midNumbers[12], midNumbers[14]);
				midNumbers = midNumbers.slice(15, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Lydian":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[5], midNumbers[7], midNumbers[9], midNumbers[11], midNumbers[12], midNumbers[14], midNumbers[15]);
				midNumbers = midNumbers.slice(16, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Mixolydian":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[7], midNumbers[9], midNumbers[11], midNumbers[12], midNumbers[14], midNumbers[15], midNumbers[16]);
				midNumbers = midNumbers.slice(17, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Aeolian":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[9], midNumbers[11], midNumbers[12], midNumbers[14], midNumbers[15], midNumbers[16], midNumbers[18]);
				midNumbers = midNumbers.slice(19, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
		case "Locrian":
			for(let i=1; i<8; i++){
				alphaMidCode.push(midNumbers[11], midNumbers[12], midNumbers[14], midNumbers[15], midNumbers[16], midNumbers[18], midNumbers[20]);
				midNumbers = midNumbers.slice(21, -1);
			}
			alphaMidCode = alphaMidCode.slice(0, 26);
			break;
	}


	// maps midi numbers created according to user input to each letter in the alphabet
	for(let i=0; i<26; i++){
		alphaMidiFinal[Object.keys(alphaMidiFinal)[i]]= alphaMidCode[i];
	}
	
	// Start with a new track
	const track2 = new MidiWriter.Track();
	
	// Add some notes:
	let pitch = [];

	let nameArry = nameStrg.split('');

	for(let letter of nameArry){
		let upLet = letter.toUpperCase();
		pitch.push(alphaMidiFinal[upLet]);
	}
	
	const note = new MidiWriter.NoteEvent({pitch: pitch, duration: '4', sequential: true, repeat: 2 });
	track2.addEvent(note);

	// Generate a data URI
	const write = new MidiWriter.Writer(track2);
	let converted = write.dataUri();
	return converted;
}


module.exports = Midi;

