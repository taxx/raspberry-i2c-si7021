const Si7021 = require('si7021-sensor');
require('dotenv').config();

const mqtt = require('mqtt');
const options = {
    username: process.env.MQTTUSER,
    password: process.env.MQTTPASS
};
const topic = process.env.MQTTTOPIC;
const mqttClient = mqtt.connect(process.env.MQTTSERVER, options);

const timeBetweenReports = 30000;

mqttClient.on('connect', function() { // When connected
    {   
        console.log('MQTT Connected!');
    }
});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function reportMQTT (temperature, humidity) {
    if ((temperature == 0 && humidity == 0) || (temperature > 200 || humidity > 200) ) {
        console.log('Skipping MQTT report since temperature and humidity are out of range')
    } else {

        var o = {} // empty Object
        var key = 'si7021';

        var data = {
            temperature: temperature,
            humidity: humidity
        };

        o[key] = data; // empty Array

        console.log(JSON.stringify(o));

        mqttClient.publish(topic + '/', JSON.stringify(o), function() {
            console.log('    - MQTT Message is published!');
        });
    }
}

console.log('Started program!');

// Si7021 constructor options object is optional, i2cBusNo defaults to 1
const si7021 = new Si7021({ i2cBusNo : 1 });

const readSensorData = () => {
  si7021.readSensorData()
    .then((data) => {
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      reportMQTT(data.temperature_C.toFixed(2), data.humidity.toFixed(2))
      setTimeout(readSensorData, timeBetweenReports);
    })
    .catch((err) => {
      console.log(`Si7021 read error: ${err}`);
      setTimeout(readSensorData, timeBetweenReports);
    });
};

si7021.reset()
  .then((result) => readSensorData())
  .catch((err) => console.error(`Si7021 reset failed: ${err} `));
