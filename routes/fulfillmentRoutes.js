const {WebhookClient} = require('dialogflow-fulfillment');
const mongoose = require('mongoose');
const Registration = mongoose.model('registration');

const {dialogflow} = require('actions-on-google');
const dfApp = dialogflow();

module.exports = app => {
    app.post('/', (req, res) => {
        const agent = new WebhookClient({ request: req, response: res });

        async function getMyInfo(agent) {    
            let id = '5e8f850ece359e3680efa60e';
            let registration = await Registration.findById(agent.parameters.id);
            const name = registration.name; 
            const address = registration.address; 
            const phone = registration.phone; 

            agent.add(`Here is your information; Name:${name} Address:${address} Phone:${phone}`);    
        }
        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }

        let intentMap = new Map();
        
        intentMap.set('Get my info', getMyInfo);
        intentMap.set('Default Fallback Intent', fallback);

        agent.handleRequest(intentMap);
    });

} 
