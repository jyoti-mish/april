// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const Temp_ACTION = 'SettempIntent';
const status_ACTION = 'SetStatusIntent';
const SETPOINT_ARGUMENT = 'SetPoint';
const NUMBER_ARGUMENT = 'Temp';

// [START YourAction]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));
  let color = assistant.getArgument(SETPOINT_ARGUMENT);
  function makeName (assistant) {
    let number = assistant.getArgument(NUMBER_ARGUMENT);
  //  let color = assistant.getArgument(SETPOINT_ARGUMENT);
    assistant.tell('Alright, your silly name is ' +
      color + ' ' + number +
      '! I hope you like it. See you next time.');
  }
if(color.toLowerCase()=='heatsetpoint'||color.toLowerCase()=='coolsetpoint')
{  let actionMap = new Map();
  actionMap.set(Temp_ACTION, makeName);
}
else{
	let actionMap = new Map();
  actionMap.set(status_ACTION, makeName);
}


  assistant.handleRequest(responseHandler);
});
// [END YourAction]

if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}

module.exports = app;
