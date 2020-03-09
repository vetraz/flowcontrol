const SerialWCProcessor = require('./modules/serialWCprocessor');
const WebSocket = require('ws');

const toiletsNotifier = new SerialWCProcessor.ToiletsEmitter(process.env.SERIAL_PORT, process.env.DEBUG, process.env.SPOILTIME);

const ToiletsLatestStates = {
    1: {
        state: SerialWCProcessor.TOISTATES.FREE,
        updateTime: Date.now()
    },
    2: {
        state: SerialWCProcessor.TOISTATES.FREE,
        updateTime: Date.now()
    },
    3: {
        state: SerialWCProcessor.TOISTATES.FREE,
        updateTime: Date.now()
    }
};

toiletsNotifier.on('data', function (toilet) {
    const latestToiletState = ToiletsLatestStates[toilet.index];
    if (latestToiletState && latestToiletState.state !== toilet.state) {
        latestToiletState.state = toilet.state;
        latestToiletState.updateTime = Date.now();
        notifyUI();
    }
});

//WebSocket Server
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 7777 });
wss.on('connection', function connection(ws, req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Got connection from " + ip);

    ws.on('message', function incoming(message) {
        console.log('received: %s from %s', message, ip);
    });

    ws.send(getToiletsStates()); //send state on connection established
});

function getToiletsStates() {
    return JSON.stringify(ToiletsLatestStates);
}

function notifyUI() {
    let latestState = getToiletsStates();
    wss.clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(latestState);
        }
    });

    if (process.env.DEBUG) {
        console.log(latestState);
    }
}
