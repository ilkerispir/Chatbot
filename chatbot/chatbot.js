const dialogflow = require('dialogflow');
const structjson = require('./structjson.js');
const config = require('../config/keys');
const mongoose = require('mongoose');
const {WebhookClient} = require('dialogflow-fulfillment');

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
    client_email: config.googleClientEmail,
    private_key:
    config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({projectId, credentials});

const Registration = mongoose.model('registration');

module.exports = {
    textQuery: async function(text, userID, parameters = {}) {
        let self = module.exports;
        const sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: languageCode,
                },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        };
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },
    eventQuery: async function(event, userID,  parameters = {}) {
        let self = module.exports;
        let sessionPath = sessionClient.sessionPath(projectId, sessionId + userID);
        
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: languageCode,
                },
            }
        };
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    }, 
    handleAction: function(responses){
        let self = module.exports;
        let queryResult = responses[0].queryResult;
        switch (queryResult.action) {
            
            case 'recommendproducts-yes':
                console.log("deneme");
                if (queryResult.allRequiredParamsPresent) {
                    console.log("deneme");
                    self.saveRegistration(queryResult.parameters.fields);
                }
                break;
        }

        //console.log(queryResult);
        //console.log(queryResult.allRequiredParamsPresent);
        //console.log(queryResult.fulfillmentMessages);
        //console.log(queryResult.parameters);
        return responses;
    },
 
    saveRegistration: async function(fields){
        const registration = new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            dateSent: Date.now()
        });
        try{
            let reg = await registration.save();
            console.log(reg);
        } catch (err){
            console.log(err);
        }
    }
} 