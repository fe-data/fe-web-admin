const myAudioContext = new AudioContext();

async function detectQrcode(byteData) {
  return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob([byteData], {type: 'image/png'}));

      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const result = jsQR(imgData.data, img.width, img.height);
        if (result) {
            return resolve('{"result": "' + result.data + '", "error": "0"}');
        } else {
            return resolve('{"result": "", "error": "1"}');
        }
      }
      img.src = url;
  });
}

function beep(duration, frequency, volume){
    return new Promise((resolve, reject) => {
        try{
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type= "square";
            gainNode.connect(myAudioContext.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        }catch(error){
            reject(error);
        }
    });
}

function delay(duration) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), duration);
    });
}

function playWebBeep() {
Promise.resolve()
  .then(() => beep(100, 480, 40))
  .then(() => delay(100))
  .then(() => beep(100, 480, 40))
}