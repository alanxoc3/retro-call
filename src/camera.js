var camera = (function() {
   let options;
   let video, canvas, context;
   let renderTimer;

   async function initVideoStream() {
      video = document.createElement("video");
      video.setAttribute('width', options.width);
      video.setAttribute('height', options.height);
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');

      if (navigator.mediaDevices) {
         await navigator.mediaDevices.getUserMedia({
            video: true,
            facingMode: "user",
         }).then((stream) => {
            video.srcObject = stream;
            video.onloadedmetadata = (e) => {
               startCapture()
            };

            initCanvas();
         }).catch(options.onError);
      }
   }

   function initCanvas() {
      canvas = options.targetCanvas || document.createElement("canvas");
      canvas.setAttribute('width', options.width);
      canvas.setAttribute('height', options.height);
      context = canvas.getContext('2d');

      if (options.mirror) {
         context.translate(canvas.width, 0);
         context.scale(-1, 1);
      }
   }

   function startCapture() {
      video.play();

      renderTimer = setInterval(function() {
         context.drawImage(video, 0, 0, video.width, video.height);
         options.onFrame(canvas);
      }, Math.round(1000 / options.fps));
   }

   function pauseCapture() {
      if (renderTimer) clearInterval(renderTimer);
      video.pause()
   }

   return {
      init: async function(captureOptions) {
         options = captureOptions || {};

         options.fps = options.fps || 30;
         options.mirror = options.mirror || false;
         options.targetCanvas = options.targetCanvas || null;

         await initVideoStream();
      },

      start: startCapture,
      pause: pauseCapture
   };
})();

export { camera };
