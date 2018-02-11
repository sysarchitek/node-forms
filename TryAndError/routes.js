// routes.js
'use strict';

const express = require('express')
const router = express.Router()

//validate
const { check, validationResult } = require('express-validator/check')

//sanitize
const { matchedData } = require('express-validator/filter')


/****** MQtt declaration ***/
/*
npm install azure-event-hubs --save
npm install azure-iot-device --save
npm install azure-iot-device-mqtt --save
 */
// following https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-getstarted#create-a-simulated-device-app

//const EventHubClient = require('azure-event-hubs').Client;

/*
//This time we use the device connection and not the hub
//otherwise we get: unkown function sendEvent
const connectionString = 'HostName=DataBoxHub.azure-devices.net;DeviceId=DataBoxDevice;SharedAccessKey=QNhUokaBq0FoSYAoCalyQD+tP2yl6CPGbR6kCL0oMy4=';
const clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
const Message = require('azure-iot-device').Message;
*/
const Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
const connectionString = 'HostName=DataBoxHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=RAx6yZ/8axyQyTo03MSzjFvxPNYRZkXUkIzAC+Mh9I0=';
const targetDevice="DataBoxDevice";
const client = Client.fromConnectionString(connectionString);


/****** Form implementation***/

//file
//npm install multer
//npm install datauri
const multer=require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const Datauri = require('datauri');
const fs=require('fs');

//https://www.sitepoint.com/forms-file-uploads-security-node-express/
router.get('/', (req, res) => {
  res.render('index')
})

router.get('/console', (req, res) => {
  res.render('console', {
    data: {},
    errors: {}
  })
})


router.post('/console',upload.single('photo'),  [
//validate

], (req, res) => {
	// Create a genre object with escaped and trimmed data.

	  console.log("# inf request is",req.body);
	  const errors = validationResult(req)
	  if (!errors.isEmpty()) {
	    return res.render('console', {
	      data: req.body,
	      errors: errors.mapped()
	    })
	  }

	  //sanitize
	  const data = matchedData(req);
	  console.log('Sanitized: ', data);
	  // Homework: send sanitized data in an email or persist in a db
	  
	
	  
	    if (req.file) {
		    console.log('Uploaded: ', req.file);
		    //https://blog.stvmlbrn.com/2017/12/17/upload-files-using-react-to-node-express-server.html
		    //https://www.ibm.com/developerworks/community/blogs/a509d54d-d354-451f-a0dd-89a2e717c10b/resource/BLOGS_UPLOADED_IMAGES/ScreenShot2016-11-29at14.58.43.png
		    //https://github.com/expressjs/multer
		    //https://www.manthanhd.com/2016/06/26/handling-file-uploads-in-express/
		    //https://github.com/expressjs/multer/issues/198#issuecomment-327403675
		    //https://github.com/expressjs/multer/issues/337#issuecomment-251575772
		    
		    
			var multer_storage = multer.memoryStorage();
			var multer_file = multer({ storage : multer_storage }).single('image');
			var datauri_image = function (req, res, next) {
			  upload(req,res,function(err) {
			    var datauri = new Datauri();
			    if ("image/png"==req.file.mimetype)
			    	datauri.format('.png', req.file.buffer)
			    else
			    	datauri.format('.jpg', req.file.buffer)
			    cloudinary.uploader.upload(datauri.content,
			      function(result) {
			        if(result.public_id){
			         //res.sendStatus(200)
			        }else{
			          res.sendStatus(500);
			        }
			      }
			    );
			  });
			};

			/*
			//https://www.thepolyglotdeveloper.com/2016/02/convert-an-uploaded-image-to-a-base64-string-in-node-js/
		    var fileInfo = [];
		    var i=0;
		    for(i = 0; i < req.file.length; i++) {
		    	console.log("dealing with file "+i)
		        fileInfo.push({
		            "originalName": req.files[i].originalName,
		            "size": req.files[i].size,
		            "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
		        })};
		    console.log("#inf file treated:"+i)
		    var file_images=fileInfo[0];
		    */
		    var file_image={
		    			"originalname": req.file.originalname,
		            	"size": 		req.file.size,
		            	"b64": 			req.file.buffer.toString("base64")
	    					};
			
			/*
		    var multer_storage = //multer({storage: 
		    			multer.memoryStorage()
		    						//}).single('file')
		    						; //file being the file attribute
		    //var upload = multer({ storage: storage })
		    var multer_file= multer({ storage : multer_storage }).single('file');
		    */
		    //console.log("multer_storage="+JSON.stringify(multer_storage));
		    //console.log("multer_file="+JSON.stringify(multer_file));
		    //console.log("datauri_image"+datauri_image);
		    //console.log("files_image"+files_image);
		    console.log("file_image"+file_image);

		    sendCmd(req.body,file_image);
		    // Homework: Upload file to S3
	    }
	    else
	    	sendCmd(req.body)

	  req.flash('success', 'Order taken in account')
	  //res.redirect('/')
})

module.exports = router

/****** MQtt implementation ***/

client.open()

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function receiveFeedback(err, receiver){
	  receiver.on('message', function (msg) {
	    console.log('Feedback message:')
	    console.log(msg.getData().toString('utf-8'));
	  });
	}

function sendCmd(body,file)
{
//https://www.codementor.io/codementorteam/how-to-use-json-files-in-node-js-85hndqt32
//var myContent=JSON.parse(body);
var myJSON=JSON.stringify(body);
var myContent=JSON.parse(myJSON);
console.log("# inf json is",myContent);
if (myContent.hasOwnProperty('cmd'))
	{
	var cmd=myContent.cmd;
	console.log("# inf send cmd:["+cmd+"]");
	if ("fill"==cmd)
		{
		var data = JSON.stringify({ deviceId: 'DataBoxDevice', cmd:	cmd,file: file});
		console.log("long data is file="+file.originalname);
		}
	else
		var data = JSON.stringify({ deviceId: 'DataBoxDevice', cmd:	 cmd});
	var message = new Message(data);
	//message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
	
	console.log("Sending message: " + message.getData());
	
	client.open(function (err) {
		  if (err) {
		    console.error('Could not connect: ' + err.message);
		  } else {
		    console.log('Service client connected');
		    client.getFeedbackReceiver(receiveFeedback);
		    //var message = new Message('Cloud to device message.');
		    //message.ack = 'full';
		    message.ack = 'positive';
		    message.messageId = "My Message ID";
		    console.log('Sending message: ' + message.getData());
		    client.send(targetDevice, message, printResultFor('send'));
		  }
		});
	
	/*
	client.sendEvent(message, printResultFor('send'));
    client.on('message', function (message) { 
        console.log(message); 
        client.complete(message, function () {
          console.log('completed');
        });
      }); 
    */
	/*
	var connectCallback = function (err,data) {
		  if (err) {
		    console.error('Could not connect: ' + err);
		  } else {
		    console.log('Client connected');
		    var message = new Message('some data from my device');
		    client.sendEvent(message, function (err) {
		      if (err) console.log(err.toString());
		    });
		 
		    client.on('message', function (msg) { 
		      console.log(msg); 
		      client.complete(msg, function () {
		        console.log('completed');
		      });
		    }); 
		  }
		};
		
		//client.open(connectCallback);
	*/
		
	}
else
	console.log("# err body as no cmd in it");
}