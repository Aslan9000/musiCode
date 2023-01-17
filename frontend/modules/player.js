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
        this.fancyWord = document.querySelectorAll('.aniword h4');
        this.events();
    }

    // Events
    events(){
        this.convertForm.addEventListener('submit', (e)=> { e.preventDefault(); this.convertToNotes(this.inputField.value) });
    }
    
    // Methods

    async convertToNotes(word){
        let convertUri = await axios.post('/musicify', {input: word, _csrf: this._csrf});
        this.playBtn.addEventListener('click', ()=> this.playMid(convertUri.data));
        for(let i=0; i < this.fancyWord.length; i++ ){ this.fancyWord[i].innerHTML = this.inputField.value};
        this.inputField.value = "";
        
    }

    playMid(convertUri){
        let AudioContext = window.AudioContext || window.webkitAudioContext || false; 
        let ac = new AudioContext || new webkitAudioContext;
        Soundfont.instrument(ac, 'acoustic_grand_piano').then(function(piano){
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

}



