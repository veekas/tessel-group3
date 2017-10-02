// var tessel = require('tessel');
// var ambientlib = require('ambient-attx4');

// var ambient = ambientlib.use(tessel.port['A']);

// ambient.on('ready', function () {
//  // Get points of light and sound data.
//   setInterval( function () {
//     ambient.getLightLevel( function(err, lightdata) {
//       if (err) throw err;
//       ambient.getSoundLevel( function(err, sounddata) {
//         if (sounddata > 0.1){
//           console.log("SO LOUD!")
//         }
//         if (err) throw err;
//         console.log("Light level:", lightdata.toFixed(8), " ", "Sound Level:", sounddata.toFixed(8));
//       });
//     });
//   }, 500); // The readings will happen every .5 seconds
// });

// ambient.on('error', function (err) {
//   console.log(err);
// });



// var tessel = require('tessel');

// var servolib = require('servo-pca9685');

// var servo = servolib.use(tessel.port['B']);

// var servo1 = 1; // We have a servo plugged in at position 1
// var servo2 = 2;

//   servo.configure(servo1, 0.05, 1, function () {
//     servo.move(1, 0.15)
//   });
//   servo.configure(servo2, 0.05, 1, function () {
//     servo.move(2, 0.15)
//   });
// });
//    // Clear it
//     ambient.clearSoundTrigger();

//    //After 10 seconds reset sound trigger
//     setTimeout(function () {

//      ambient.setSoundTrigger(0.075);
//      console.log('10 sec has passed')
//    }, 10000);

//  });
// });

// ambient.on('error', function (err) {
//   console.log(err);
// });

/////////////
var tessel = require('tessel');
var servolib = require('servo-pca9685');
const av = require('tessel-av');
const http = require('http');
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['A']);

const portNumber = 3210;
const camera = new av.Camera();
const takePicture = camera.capture();

var servo = servolib.use(tessel.port['B']);

var servo1 = 1; // We have a servo plugged in at position 1

servo.on('ready', function () {
  var position = 0;  //  Target position of the servo between 0 (min) and 1 (max)

ambient.on('ready', function () {

  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(0.075);

  console.log('Waiting for a loud sound...');

  ambient.on('sound-trigger', function (data) {
    console.log('Something happened with sound: ', data);

    takePicture.on('data', (image) => {
      console.log('taking picture');

      const request = http.request({
        hostname: '172.16.22.212', // veekas's IP address
        port: portNumber,
        path: '/pic',
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpg',
          'Content-Length': image.length
        }
      });

      request.write(image);

    });

    takePicture.on('error', (err) => console.error(err));

    // servo.move(1, 0.05);
    // servo.move(2, 0.05);
    servo.on('ready', function () {
      var position = 0.05;  //  Target position of the servo between 0 (min) and 1 (max).

  //  Set the minimum and maximum duty cycle for servo 1.
  //  If the servo doesn't move to its full extent or stalls out
  //  and gets hot, try tuning these values (0.05 and 0.12).
  //  Moving them towards each other = less movement range
  //  Moving them apart = more range, more likely to stall and burn out

  servo.configure(servo1, 0.05, 0.1, function () {
    setTimeout(function(){
      // position += 1
      servo.move(servo1, 0.4)
      console.log("moved 1")

    },0)
    setTimeout(function(){
      servo.move(servo1, 0.03)
      console.log("moved 2")
    }, 5000)
    // setTimeout(function(){
    // servo.move(servo1, position)
    // console.log("moved 3")
    // }, 10000)

             // Increment by 10% (~18 deg for a normal servo)
      // position += 0;
      // if (position > 0.7) {
      //   position = 0; // Reset servo position
      // }
 // Every 500 milliseconds
  });
});
