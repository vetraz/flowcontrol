# floWControl. Webserver for wc status monitoring.
FloWControl is node.js based webserver which serves wc states over websockets. This package includes static server for html and resources, and websocket server for events transmitting to that static web-page (or browser extension - see next). Starts via pm2 configuration or npm scripts with aditional env variables. Websocket-server reads data from COM-port which is piping data from a reciever based on arduino with nRF24-module.


# Firmware

## Prepare:
* [Download](https://www.arduino.cc/en/Main/Software) the Arduino IDE
* `firmware` folder contains files for flashing transmitters and receiver

Flashing issues with custom Arduino NANO:

`ISSUE` 
* Your board is recognized by Windows correctly (device driver is installed and you can see COM port N) but you can't flash it

`SOLUTION` 
1. Select ***Tools\Board\Arduino Nano*** 
2. Select ***Tools\Processor\ATmega328P(Old Bootloader)***

##### Documentation
* Radio data transfer library (RF24) documentation - http://tmrh20.github.io/RF24/classRF24.html
* JS library to work with COM-port https://serialport.io

### Pin connection
* NRF24 uses 3.6V MAX!!!
#### NRF24 <-> Arduino UNO
* CE - 8
* CSN - 10
* MOSI - 11
* MISO - 12
* SCK - 13
* VCC - +3.3v
* GND - GND
#### NRF24 <-> Arduino Micro Pro
* CE - 9
* CSN - 10
* MOSI - 16
* MISO - 14
* SCK - 15
* VCC - VCC (+3.3v)
* GND - GND
#### NRF24 <-> Arduino Nano
* CE - D9
* CSN - D10
* MOSI - D11
* MISO - D12
* SCK - D13
* VCC - +3.3v
* GND - GND

# Server

## Usage
* `npm install` - download dependencies
* `npm start` - start both servers in foreground (won't start without configuration of serial port. For details see **Possible environmental variables**)

## Possible environmental variables
* `SERIAL_PORT` - **(REQUIRED)** sets serial port of arduino server. *For examle, COM5 or /dev/ttyUSB0*
* `HTTP_PORT` - sets static webserver port. *Default: 9696*
* `WEBSOCKET_PORT` - sets websocket setver port. *Default: 7777*
* `DEBUG` - prints additional debug info. *Default: false*
* `SPOILTIME` - number of milliseconds after what toilet will be considered free. *Default: 3000*

## Bare minimum to run server:
* WINDOWS - `set SERIAL_PORT=COM5&& npm start` (use correct COM port number)
* LINUX - `export SERIAL_PORT=/dev/ttyUSB0 && npm start` (use correct device address. use `dmesg | grep tty` to identify your device)

or with some additional options:

* WINDOWS - `set SERIAL_PORT=COM5 && set DEBUG=true && set SPOILTIME=5000 && npm start`
* LINUX - `export SERIAL_PORT=/dev/ttyUSB0 && export DEBUG=true && export SPOILTIME=5000 && npm start`

## PM2-controled server
copy `ecosystem.config.js` from `config_examples` folder to project root folder and run the following command:

* `npm install pm2@latest -g` - install pm2 globally

adjust `env_production` settings in `ecosystem.config.js` for your setup. Uncomment static server section if needed (not served for example by nginx)

* `pm2 start ecosystem.config.js --env production` - adds new server to pm2 and starts it
* `pm2 monit` - shows app status
* `pm2 logs` - shows current logs

for reloading use:
* `pm2 restart ecosystem.config.js --env production`

### Linux hints
Initial setup may push you to allow access to your device from application. To do so, run following command:
`sudo chmod a+rwx /dev/ttyUSB0`

# Big thanks for support and contribution to:
* Konstantin Alesionok - https://github.com/ikozzz
* Sergey Petkevich
* Ilya Lashch