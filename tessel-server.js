const app = require('express')();
const portNumber = 3210;
const cloudinary = require('cloudinary');
const axios = require('axios');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'veekas',
  api_key: '681336176687797',
  api_secret: 'hNS03JYo_61YzoECqoNkGAcd_UE'
});

app.listen(portNumber, () => {
  console.log('running on port: ' + portNumber);
});

app.post('/pic', (req, res, next) => {
  console.log('People are being loud. Taking a picture.');
  let newPic = new Buffer(0);

  req.on('data', (chunk) => {
    newPic = Buffer.concat([newPic, chunk]);
  });

  req.on('end', () => {
    fs.writeFile('./perpShot.jpg', newPic);
  });

});

app.get('/pic', (req, res, next) => {
  res.sendFile(__dirname + 'perpShot.jpg');
  cloudinary.uploader.upload('perpShot.jpg', function (result) {
    console.log(result.url)
    axios.post('https://hooks.slack.com/services/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',
      {
        channel: '#loud-mouths',
        username: 'Noise Police',
        text: 'Keep your voices down!',
        icon_emoji: ':police_car:',
        attachments: [
          {
            fallback: 'Today\'s perpetrators:',
            pretext: 'Today\'s perpetrators:',
            image_url: result.url
          }
        ]
      });
    })
    .then(res => res.data)
    .then(complete => {
      console.log('complete: ', complete);
      res.send(complete);
    });
});

