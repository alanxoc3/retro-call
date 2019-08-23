import React from 'react';
import './SpeechText.css';


class SpeechText extends React.Component {
   constructor() {
      super();
      this.state = {transcript: ""};
   }

   setup = () => {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (e) => {
         var last = e.results.length - 1;
         var transcript = e.results[last][0].transcript;
         this.setState({transcript: transcript + "."});
      }

      this.recognition.onerror = (e) => {
         this.setState({transcript: 'Error occurred in recognition: ' + e.error});
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
