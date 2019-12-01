const EventEmitter = require('events');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const TOISTATES = {
	BUSY: "busy",
	FREE: "free",
};

const Toilets = {
	1: "Central area MAN toilet",
	2: "Kitchen area MAN toilet",
	3: "Central area WOMAN toilet"
};

class SerialWCProcessor extends EventEmitter {

	constructor(serialPort, debug, spoilTime) {
		super();

		this.debugModeEnabled = !!debug;
		this.spoilTime = spoilTime || 3000;
		this.spoiledTimers = {};

		const linesParser = new Readline();
		const port = new SerialPort(serialPort, { baudRate: 9600 });

		// continuously read SerialPort
		port.pipe(linesParser);

		//when line is complete => process line
		linesParser.on('data', this.observeHardwareChanges.bind(this));
		this.observeSpoiledData(); //actually no need to call this. Main function now is to create object with keys.
	}

	observeHardwareChanges(data) {
		if (this.debugModeEnabled) { //print raw data
			console.log(`Received by RNF24: ${data}`);
		}
		let toilet = this.parseToiletData(data);
		if (toilet) {
			if (this.debugModeEnabled) {
				console.log(`${Toilets[toilet.index]} is ${toilet.state} at ${new Date}`);
			}
			this.publishNewToiletState(toilet);
			this.renewSpoilTimer(toilet.index);
		}
	}

	observeSpoiledData() {
		const renewSpoilTimer = this.renewSpoilTimer.bind(this);
		Object.keys(Toilets).forEach(renewSpoilTimer);
	}

	renewSpoilTimer(toiletKey) {
		clearTimeout(this.spoiledTimers[toiletKey]);
		this.spoiledTimers[toiletKey] = setTimeout(()=>{
			let toilet = {
				index: toiletKey,
				state: TOISTATES.FREE,
			};

			if (this.debugModeEnabled) {
				console.log(`${Toilets[toilet.index]} is ${toilet.state} at ${new Date} (by spoil checker)`);
			}

			this.publishNewToiletState(toilet);
		}, this.spoilTime);
	}

	publishNewToiletState(toilet) {
		this.emit('data', toilet);
	}

	// Index [0] is a id number of toilet
	parseToiletData(data) {
		const toilet = {
			index: null,
			state: null,
		};

		if (!data || isNaN(parseInt(data))) {
			//skip wrong data
			return;
		}

		toilet.index = parseInt(data[0]);
		toilet.state = TOISTATES.BUSY;

		return toilet;
	}
}

module.exports = {
	ToiletsEmitter: SerialWCProcessor,
	TOISTATES
};