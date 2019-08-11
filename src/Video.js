import React from 'react';
import './Video.css';
import {camera} from './camera';
import {pico8ify} from './vid_filters';

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 500,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
     curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
};


function distort_audio(audioCtx, source) {
   var distortion = audioCtx.createWaveShaper();
   var filter = audioCtx.createBiquadFilter();

   filter.type = 'allpass'
   filter.frequency.value = 440;

   source.connect(filter);
   filter.connect(audioCtx.destination);
}

class Video extends React.Component {
   draw = (buf_canvas) => {
      const bctx = buf_canvas.getContext('2d');

      const canvas = document.getElementById('vid');
      const ctx = canvas.getContext('2d');

      const canvas2 = document.getElementById('vid2');
      const ctx2 = canvas2.getContext('2d');

      pico8ify(bctx, ctx, this.scale);
      pico8ify(bctx, ctx2, this.scale);
   };

   scale = 4

   componentDidMount() {
      camera.init({
         width: 128,
         height: 128,
         mirror: true,
         fps: 30,
         targetCanvas: document.getElementById('buf'),
         onFrame: this.draw.bind(),
         distort_audio: distort_audio,
         onError: () => {
            console.log("Error bro.")
         }
      },
      );
   }

   render() {
      return <>
         <canvas id="buf" className="buf"/>
         <canvas width={128*this.scale} height={128*this.scale} id="vid" className="vid"/>
         <canvas width={128*this.scale} height={128*this.scale} id="vid2" className="vid"/>
      </>;
   }
}

export default Video;
