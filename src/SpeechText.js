import React from 'react';
import './SpeechText.css';

function play_note(note) {
   let note_map = {
      a: 880.0000,
      b: 987.7666,
      c: 523.2511,
      d: 587.3295,
      e: 659.2551,
      f: 698.4565,
      g: 783.9909,
      0: 932.3275,
      1: 830.6094,
      2: 739.9888,
      3: 622.2540,
      4: 554.3653
   }

   var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   if (note_map[note]) {
      // create Oscillator node
      var oscillator = audioCtx.createOscillator();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(note_map[note], audioCtx.currentTime); // value in hertz
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      // end
   }
}


class SpeechText extends React.Component {
   constructor() {
      super();
      this.state = {transcript: ""};
   }

   setup = () => {
      // create web audio api context
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (e) => {
         var last = e.results.length - 1;
         var transcript = e.results[last][0].transcript.toUpperCase();
         this.setState({transcript: transcript});
         clearTimeout(this.timeout)
         this.timeout = setTimeout(() => {
            this.setState({transcript: ''});
            play_note('a')
         }, Math.log(this.state.transcript.length+1)*1000)
      }

      this.recognition.onspeechstart = () => {
         console.log("Speech started?")
      }

      this.recognition.onerror = (e) => {
         console.error('recognition error', e);
         switch (e.error) {
            case 'not-allowed':
            case 'service-not-allowed':
               alert('Something went wrong with speech recognition. Try refreshing.');
               break;
            case 'no-speech':
               this.recognition.abort()
               this.setup()
               break;
            case 'network':
            default:
               break;
         }
      }

      this.recognition.start();
   }

   componentDidMount() {
      this.setup();
   }

   render() {
      return <>
         <h1>{this.state.transcript}</h1>
      </>;
   }
}

export default SpeechText;
