
Project:
https://github.com/sysarchitek/DataBox.Console
Solution:
https://github.com/sysarchitek/DataBox-IOT-Emulator
=======
# DataBox Emulator Console based on the work of the Node form.js

This form use MQtt to communicate with the raspberry emulator


author: Francois TURI

Please update 
src>routes.js
Line31:
const Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
const connectionString = 'HostName=DataBoxHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=[IOThubownerKEY]=';
const targetDevice="DataBoxDevice";
const client = Client.fromConnectionString(connectionString);




Based on works of:

https://www.sitepoint.com/creating-and-handling-forms-in-node-js/
## License

The MIT License (MIT)

Copyright (c) 2018 SitePoint

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
