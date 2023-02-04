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
		this.convertForm.addEventListener('submit', (e)=> { e.preventDefault(); this.convertToNotes(this.inputField.value, this.middleC, this.key, this.scale, this.mode) });
		[this.middleC, this.scale].forEach(el => {el.addEventListener('change', ()=> this.selectOctRange(this.middleC, this.scale))});
		this.scale.addEventListener('change', ()=> this.selectWholeTone(this.scale));
	}
    
    // Methods

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
					piano.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
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



