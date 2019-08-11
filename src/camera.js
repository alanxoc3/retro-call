var camera = (function() {
   let options;
   let video, canvas, context;
   let renderTimer;

   let audioCtx = new AudioContext();
   // var buffer = audioCtx.createBuffer(1, 22050, 22050);

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

         await navigator.mediaDevices.getUserMedia({
            audio: {
               optional: [{ echoCancellation: false }]
            },
            facingMode: "user",
         }).then((stream) => {
            var source = audioCtx.createMediaStreamSource( stream );
            options.distort_audio(audioCtx, source);
            source.start();
         }).catch(options.onError);

      } else {
         options.onNotSupported();
      }
   }

   function initCanvas() {
      canvas = options.targetCanvas || document.createElement("canvas");
      canvas.setAttribute('width', options.width);
      canvas.setAttribute('height', options.height);

      context = canvas.getContext('2d');

      // mirror video
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
         var doNothing = function(){};

         options = captureOptions || {};

         options.fps = options.fps || 30;
         options.width = options.width || 640;
         options.height = options.height || 480;
         options.mirror = options.mirror || false;
         options.targetCanvas = options.targetCanvas || null;

         options.onSuccess = options.onSuccess || doNothing;
         options.onError = options.onError || doNothing;
         options.onNotSupported = options.onNotSupported || doNothing;
         options.onFrame = options.onFrame || doNothing;

         await initVideoStream();
      },

      start: startCapture,
      pause: pauseCapture
   };
})();

export { camera };
