// Alexa SDK for JavaScript v1.0.00
// Copyright (c) 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved. Use is subject to license terms.

/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * URL prefix to download history content from Wikipedia
 */
var urlPrefix = 'https://web.lntdemoprojects.com/raswcfservice/RASWCFService.svc/';
var urlPrefix1 = 'https://web.lntdemoprojects.com';

/**
 * Variable defining number of events to be read at one time
 */
var paginationSize = 3;

/**
 * Variable defining the length of the delimiter between events
 */
var delimiterSize = 2;

/**
 * HistoryBuffSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HistoryBuffSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HistoryBuffSkill.prototype = Object.create(AlexaSkill.prototype);
HistoryBuffSkill.prototype.constructor = HistoryBuffSkill;

HistoryBuffSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HistoryBuffSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

HistoryBuffSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HistoryBuffSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

HistoryBuffSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

HistoryBuffSkill.prototype.intentHandlers = {

 StatusIntent: function (intent, session, response) {
        handleStatusRequest(intent, session, response);
    },
   SetTempIntent: function (intent, session, response) {
        handleFirstEventRequest(intent, session, response);
   },

   //GetNextEventIntent: function (intent, session, response) {
   //    handleNextEventRequest(intent, session, response);
  // },

    HelpIntent: function (intent, session, response) {
        var speechOutput = "With History Buff, you can get historical events for any day of the year.  " +
            "For example, you could say today, or August thirtieth, or you can say exit. Now, which day do you want?";
        response.ask(speechOutput);
    },

    FinishIntent: function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Aprilaire";
    var repromptText = "With Aprilaire, you can control thermostat.  For example, you could say set heat point to 70 Fahrenheit . Now, what  do you want to change?";
    var speechOutput = "What  do you want to change?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.

    response.askWithCard(speechOutput, repromptText, cardTitle, speechOutput);
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
 function handleStatusRequest(intent, session, response) {
	 var setpoint = intent.slots.setpoint;
 var temp = intent.slots.temp;
	 
	
    var repromptText = "With Aprilaire, you can control thermostat.  For example, you could say set heat point to 70 Fahrenheit . Now, what  do you want to change?";
  
    var sessionAttributes = {};
    // Read the first 3 events, then set the count to 3
    sessionAttributes.index = paginationSize;
   
    // If the user provides a date, then use that, otherwise use today
    // The date is in server time, not in the user's time zone. So "today" for the user may actually be tomorrow
  var cardTitle="Aprilaire";
    var content = "Events On";
   
 getJsonEvents(setpoint, temp, function (events) {
     var prefixContent =""
	 
	   var speechText = "";
        sessionAttributes.text = events;
        session.attributes = sessionAttributes;
        if (events.length == 0) {
            speechText = "There is a problem connecting to thermostat at this time. Please try again later.";
            response.tell(speechText);
        } else {
            for (i = 0; i < 1; i++) {
                speechText = speechText + events[i] + " ";
            }
           // speechText = speechText + " Wanna go deeper in history?";
            response.askWithCard(prefixContent + speechText, repromptText, cardTitle, speechText);
        }
    });
 }
function handleFirstEventRequest(intent, session, response) {
    var setpoint = intent.slots.setpoint;
 var temp = intent.slots.temp;
	 
	
    var repromptText = "With Aprilaire, you can control thermostat.  For example, you could say set heat point to 70 Fahrenheit . Now, what  do you want to change?";
  
   var sessionAttributes = {};
    // Read the first 3 events, then set the count to 3
    sessionAttributes.index = paginationSize;
    var date = "";

    // If the user provides a date, then use that, otherwise use today
    // The date is in server time, not in the user's time zone. So "today" for the user may actually be tomorrow
//var jsonobj=JSON.stringify({"LocationId":5919,"Parameters":[{"ParameterName":"Hold Type","ParameterValue":"1"},{"ParameterName":"Hold Fan","ParameterValue":"2"},{"ParameterName":"Hold Heat Setpoint","ParameterValue":temp.value},{"ParameterName":"Hold Cool Setpoint","ParameterValue":"87"},{"ParameterName":"Hold End Minute","ParameterValue":"0"},{"ParameterName":"Hold End Hour","ParameterValue":"6"},{"ParameterName":"Hold End Date","ParameterValue":"29"},{"ParameterName":"Hold End Month","ParameterValue":"8"},{"ParameterName":"Hold End Year","ParameterValue":"16"},{"ParameterName":"Hold Dehumidification Setpoint","ParameterValue":"0"}],"ThermostatId":75503,"UserId":4,"AttributeName":"Hold"});

    var content = "";
   var prefixContent = "For heat setpoint";
    var cardTitle = "temp ";
   getJsonEventsFromWikipedia(setpoint, temp, function (events) {
        var speechText = "";
        sessionAttributes.text = events;
        session.attributes = sessionAttributes;
        if (events.length == 0) {
         //   speechText = "There is a problem connecting to Aprilaire at this time. Please try again later.";
         //   response.tell(speechText);
        } else {
            
                speechText = speechText+ " "+ events + " ";
         
          //  speechText = speechText + " Wanna go deeper in history?";
            response.askWithCard(prefixContent + speechText, repromptText, cardTitle, speechText);
        }
    });
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleNextEventRequest(intent, session, response) {
    var cardTitle = "More events on this day in history";
    var sessionAttributes = session.attributes;
    var result = sessionAttributes.text;
    var speechText = "";
    var repromptText = "Do you want to know more about what happened on this date?"
    if (!result) {
        speechText = "With History Buff, you can get historical events for any day of the year.  For example, you could say today, or August thirtieth. Now, which day do you want?";
    } else if (sessionAttributes.index >= result.length) {
        speechText = "There are no more events for this date. Try another date by saying, get events for august thirtieth.";
    } else {
        for (i = 0; i < paginationSize; i++) {
            if (sessionAttributes.index>= result.length) {
                break;
            }
            speechText = speechText + result[sessionAttributes.index] + " ";
            sessionAttributes.index++;
        }
        if (sessionAttributes.index < result.length) {
            speechText = speechText + " Wanna go deeper in history?";
        }
    }
    response.askWithCard(speechText, repromptText, cardTitle, speechText);
}
function getJsonEvents(day, date, eventCallback) {
   var url = urlPrefix + 'GetThermostatHome/4/5919/75503';

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = body;
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}
function getJsonEventsFromWikipedia(setpoint, temp, eventCallback) {
	
 var jsonobj=JSON.stringify({"LocationId":5919,"Parameters":[{"ParameterName":"Hold Type","ParameterValue":"1"},{"ParameterName":"Hold Fan","ParameterValue":"2"},{"ParameterName":"Hold Heat Setpoint","ParameterValue":temp.value},{"ParameterName":"Hold Cool Setpoint","ParameterValue":"87"},{"ParameterName":"Hold End Minute","ParameterValue":"0"},{"ParameterName":"Hold End Hour","ParameterValue":"6"},{"ParameterName":"Hold End Date","ParameterValue":"29"},{"ParameterName":"Hold End Month","ParameterValue":"8"},{"ParameterName":"Hold End Year","ParameterValue":"16"},{"ParameterName":"Hold Dehumidification Setpoint","ParameterValue":"0"}],"ThermostatId":75503,"UserId":4,"AttributeName":"Hold"});
//var jsonobj=JSON.stringify({"LocationId":5919,"Parameters":[{"ParameterName":"Hold Type","ParameterValue":"1"},{"ParameterName":"Hold Fan","ParameterValue":"2"},{"ParameterName":"Hold Heat Setpoint","ParameterValue":"84"},{"ParameterName":"Hold Cool Setpoint","ParameterValue":"87"},{"ParameterName":"Hold End Minute","ParameterValue":"0"},{"ParameterName":"Hold End Hour","ParameterValue":"6"},{"ParameterName":"Hold End Date","ParameterValue":"29"},{"ParameterName":"Hold End Month","ParameterValue":"8"},{"ParameterName":"Hold End Year","ParameterValue":"16"},{"ParameterName":"Hold Dehumidification Setpoint","ParameterValue":"0"}],"ThermostatId":75503,"UserId":4,"AttributeName":"Hold"});
var post_options = {
      host: 'web.lntdemoprojects.com',
      port: '443',
      path: '/raswcfservice/RASWCFService.svc/SetThermostatParameters/0',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': jsonobj.length
      }
  };
var callback=function(res) {
        var body = '';
res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
			if(body=="{\"Message\":\"Settings saved successfully!\",\"Result\":true}")
				{
            var stringResult = "temperature is changed.";
            eventCallback(stringResult);
				}
        });
    }
	
    https.request(post_options, callback).write(jsonobj);
}

function parseJson(text) {
    // sizeOf (/nEvents/n) is 10
    var text = text.substring(text.indexOf("\\Message\\n")+10, text.indexOf("\\n\\n\\nResult"));
    var retArr = [];
    if (text.length == 0) {
        return retArr;
    }
    var retString = "";
    startIndex = 0;
    while(true) {
        endIndex = text.indexOf("\\n", startIndex+delimiterSize);
        var eventText = (endIndex == -1 ? text.substring(startIndex) : text.substring(startIndex, endIndex));
        // replace dashes returned in text from Wikipedia's API
        eventText = eventText.replace(/\\u2013\s*/g, '');
        // add comma after year so Alexa pauses before continuing with the sentence
        eventText = eventText.replace(/(^\d+)/,'$1,');
        eventText = 'In ' + eventText;
        startIndex = endIndex+delimiterSize;
        retArr.push(eventText);
        if (endIndex == -1) {
            break;
        }
    }
    if (retString != "") {
        retArr.push(retString);
    }
    retArr.reverse();
    return retArr;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new HistoryBuffSkill();
    skill.execute(event, context);
};

