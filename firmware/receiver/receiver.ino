#include "nRF24L01.h" //NRF24L01 library created by TMRh20 https://github.com/TMRh20/RF24
#include "RF24.h"
#include "SPI.h"

int msg[1]; // Used to store value received by the NRF24L01

// http://tmrh20.github.io/RF24/
RF24 radio(9,10); // CE - 9 CSN -10
const uint64_t pipe = 0xE6E6E6E6E6E6; // Needs to be the same for communicating between 2 NRF24L01 

void setup(void){
	radio.begin(); // Start the NRF24L01
  //radio.setPALevel(RF24_PA_LOW);
  //radio.setDataRate(RF24_1MBPS);
  radio.setChannel(100); // Указываем канал передачи данных (от 0 до 125), 5 - значит передача данных осуществляется на частоте 2,405 ГГц (на одном канале может быть только 1 приёмник и до 6 передатчиков)
  radio.setDataRate(RF24_250KBPS); //reduce speed to emprove signal strength
	radio.openReadingPipe(0,pipe); // Get NRF24L01 ready to receive
	radio.startListening(); // Listen to see if information received
	Serial.begin(9600);
  Serial.println("Reciever is ready");
}

void loop(void) {
	while (radio.available()) {
		radio.read(&msg, sizeof(msg)); // Read information from the NRF24L01
		if (msg[0] != 0) {
			Serial.println(msg[0]);
		}
	}
}
