// export let invertImage = (ctx, w, h) => {
// let imageData = ctx.getImageData(0, 0, w, h);
// let data = imageData.data;
// for (let i = 0; i < data.length; i += 4) {
// data[i]     = 255 - data[i];     // red
// data[i + 1] = 255 - data[i + 1]; // green
// data[i + 2] = 255 - data[i + 2]; // blue
// }
// return imageData;
// }

let p8_pal = [
   0, 0, 0,
   29, 43, 83,
   126, 37, 83,
   0, 135, 81,
   171, 82, 54,
   95, 87, 79,
   194, 195, 199,
   255, 241, 232,
   255, 0, 77,
   255, 163, 0,
   255, 236, 39,
   0, 228, 54,
   41, 173, 255,
   131, 118, 156,
   255, 119, 168,
   255, 204, 170
]

let rgb_to_pico8 = (pr, pg, pb) => {
   let closest_index = 0
   let closest_distance = Number.MAX_SAFE_INTEGER
   for (let i = 0; i < p8_pal.length; i+= 3) {
      let r = pr - p8_pal[i]
      let g = pg - p8_pal[i+1]
      let b = pb - p8_pal[i+2]

      let distance = r*r + g*g + b*b
      if (distance < closest_distance) {
         closest_index = i
         closest_distance = distance
      }
   }

   return [
      p8_pal[closest_index],
      p8_pal[closest_index+1],
      p8_pal[closest_index+2]
   ];
}

export let pico8ify = (bctx, ctx, scale) => {
   let w = scale * 128
   let h = scale * 128
   let b_im = bctx.getImageData(0, 0, 128, 128);
   let data = b_im.data;

   ctx.clearRect(0,0,w,h)
   for (let i = 0, step = 0; i < data.length; i += 4, ++step) {
      let new_data = rgb_to_pico8(data[i], data[i+1], data[i+2])
      let c = step % 128
      let r = Math.floor(step / 128)
      ctx.fillStyle = 'rgb(' + new_data[0] + ', ' + new_data[1] + ', ' + new_data[2] + ')';
      ctx.fillRect(c*scale, r*scale, scale, scale)
   }

}

