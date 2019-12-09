import React from 'react';
import './SpeechText.css';

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

class SpeechText extends React.Component {
   constructor() {
      super();
      this.state = {transcript: ""};
   }

   play_note = (note, oscillator_number) => {
      if (note_map[note]) {
         this.oscillators[oscillator_number].frequency.setValueAtTime(note_map[note], this.audioCtx.currentTime);
      }
   }

   setup_tones = () => {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioCtx.createGain();

      this.oscillators = [
         this.audioCtx.createOscillator(),
         this.audioCtx.createOscillator()
      ]

      this.oscillators.forEach((x) => {
         x.type = 'sawtooth';
         x.frequency.setValueAtTime(880, this.audioCtx.currentTime);
         x.connect(this.gainNode);
         x.start();
      })

      this.gainNode.connect(this.audioCtx.destination);
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
            this.play_note('c', 1)
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
      this.setup_tones();
      this.setup();
   }

   render() {
      return <>
         <h1>{this.state.transcript}</h1>
      </>;
   }
}

export default SpeechText;
