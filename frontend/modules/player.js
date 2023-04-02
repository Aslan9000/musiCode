import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import axios from 'axios';
let Player;

export default class PlayerMid{
	constructor(){
		this._csrf = document.querySelector('[name="_csrf"]').value;
		this.playBtn= document.querySelector('#playBtn');
		this.pauseBtn= document.querySelector('#pauseBtn');
		this.convertForm = document.querySelector('#convertForm');
		this.inputField = document.querySelector('#musicifyInField');
		this.inputField.previuosValue = "";
		this.nameError = document.querySelector('#nameError');
		this.middleC = document.querySelector('#middleCSelect');
		this.key = document.querySelector('#keySelect');
		this.keyGroup = document.querySelector('#keyGrouping');
		this.keyOptions = document.querySelectorAll('#keySelect option');
		this.keyWTGroup = document.querySelector('#keySelectWTGrouping');
		this.scale = document.querySelector('#scaleSelect');
		this.scaleGroup = document.querySelector('#scaleGrouping');
		this.mode = document.querySelector('#modeSelect');
		this.modeGroup = document.querySelector('#modeGrouping');
		this.fancyWord = document.querySelectorAll('.aniword h4');
		this.events();
	}

	// Events
	events(){
		this.inputField.addEventListener('keyup', ()=> this.isDifferent());
		this.convertForm.addEventListener('submit', (e)=> { e.preventDefault(); this.submitHandler() });
		[this.middleC, this.scale].forEach(el => {el.addEventListener('change', ()=> this.selectOctRange(this.middleC, this.scale))});
		this.scale.addEventListener('change', ()=> this.selectWholeTone(this.scale));
	}
    
    // Methods

	isDifferent(){
		if(this.inputField.previousValue != this.inputField.value){
			this.inputField.errors = false;
			this.inputFieldImmediately();
			clearTimeout(this.inputField.timer);
			this.inputField.timer = setTimeout(()=> this.inputFieldAfterDelay(), 300);
		}
		this.inputField.previousValue = this.inputField.value;
	}

	submitHandler(){
		this.inputFieldImmediately();
		this.inputFieldAfterDelay();
		if(!this.inputField.errors){
			this.convertToNotes(this.inputField.value, this.middleC, this.key, this.scale, this.mode);
		}
	}

	inputFieldImmediately(){
		// name only contains letters
		if(this.inputField.value != "" & !/^([a-zA-Z]+)$/.test(this.inputField.value)){
			this.showValidationError("Name can only contain letters.");
		  }
		  // name can't exceed 15 characters maximum
		  if(this.inputField.value.length > 16){
			this.showValidationError("Name cannot exceed 15 characters.");
		  }
		  // if error corrected, hide error message
		  if(!this.inputField.errors){
			this.hideValidationError();
		  }
	}

	inputFieldAfterDelay(){
		// name must be 3 characters minimum
		if(this.inputField.value.length < 3){
			this.showValidationError( "Name must be at least 3 letters.");
		}
	}

	showValidationError(message){
		this.nameError.innerHTML = message;
		this.nameError.classList.add('invalid-feedback--visible');
		this.nameError.classList.remove('invalid-feedback');
		this.inputField.errors = true;
	}

	hideValidationError(){
		this.nameError.classList.remove('invalid-feedback--visible');
		this.nameError.classList.add('invalid-feedback');
	}

	async convertToNotes(word, middleC, key, scale, mode){
		middleC = middleC.options[middleC.selectedIndex].text;
		key = key.options[key.selectedIndex].text;
		scale = scale.options[scale.selectedIndex].text;
		mode = mode.options[mode.selectedIndex].text;
		let convertUri = await axios.post('/musicify', {word: word, middleC: middleC, key: key, scale: scale, mode: mode, _csrf: this._csrf});
		this.playBtn.addEventListener('click', ()=> this.playMid(convertUri.data));
		for(let i=0; i < this.fancyWord.length; i++ ){ this.fancyWord[i].innerHTML = this.inputField.value};
		this.inputField.value = "";
			
	}

	playMid(convertUri){
		let AudioContext = window.AudioContext || window.webkitAudioContext || false; 
		let ac = new AudioContext || new webkitAudioContext;
		Soundfont.instrument(ac, 'acoustic_grand_piano').then(function(piano){
			if(Player != undefined){Player.stop()};
			Player = new MidiPlayer.Player(function(event){
				if(event.name == 'Note on' && event.velocity > 0){
					piano.play(event.noteName, ac.currentTime, {gain:event.velocity/100 * 2.5});
				}
				document.querySelector('#progressBar').style.width = 100 - Player.getSongPercentRemaining() +'%' ;
					
			})
			Player.loadDataUri(convertUri);
			Player.play();
			document.querySelector('#pauseBtn').addEventListener('click', ()=> {
				Player.pause();
			});
			
		}).catch(function(err){ console.log(err)})
		
	}

	selectOctRange(middleC, scale){
		if(middleC.options[middleC.selectedIndex].innerHTML === "C3" && scale.options[scale.selectedIndex].innerHTML === "Major"){
			this.modeGroup.classList.add('d-flex');
			this.modeGroup.classList.remove('d-none');
		}else{
			this.modeGroup.classList.add('d-none');
			this.modeGroup.classList.remove('d-flex');
		}
	}

	selectWholeTone(scale){
		if(scale.options[scale.selectedIndex].innerHTML === "Whole-Tone"){
			this.keyGroup.classList.add('d-none');
			this.keyWTGroup.classList.remove('d-none');
		}else{
			this.keyWTGroup.classList.add('d-none');
			this.keyGroup.classList.remove('d-none');
			
			
		}
	}

}



