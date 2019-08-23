import React from 'react';
import './Video.css';
import {camera} from './camera';
import {pico8ify, DIM} from './vid_filters';

class Video extends React.Component {
   draw = (buf_canvas) => {
      const bctx = buf_canvas.getContext('2d');

      const canvas = document.getElementById('vid');
      const ctx = canvas.getContext('2d');

      pico8ify(bctx, ctx, this.scale);
   };

   scale = 8

   componentDidMount() {
      camera.init({
         width: DIM,
         height: DIM,
         mirror: true,
         fps: 30,
         targetCanvas: document.getElementById('buf'),
         onFrame: this.draw.bind(),
         onError: () => {
            console.log("Error bro.")
         }
      },
      );
   }

   render() {
      return <>
         <canvas id="buf" className="buf"/>
         <canvas width={DIM*this.scale} height={DIM*this.scale} id="vid" className="vid"/>
      </>;
   }
}

export default Video;
