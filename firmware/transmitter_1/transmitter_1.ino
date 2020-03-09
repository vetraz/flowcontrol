#include "nRF24L01.h" //NRF24L01 library created by TMRh20 https://github.com/TMRh20/RF24
#include "RF24.h"

int TRANSMITTER_INDEX = 1; // Transmitter index added to message

int msg[1]; // Used to store value before being sent through the NRF24L01

// http://tmrh20.github.io/RF24/
RF24 radio(9, 10); // NRF24L01 used Pin 9 (CE) and 10 (SS \ CSN) on the NANO

const uint64_t pipe = 0xE6E6E6E6E6E6; // Needs to be the same for communicating between 2 NRF24L01

void setup(void) {
  radio.begin(); // Start the NRF24L01
  radio.setChannel(100);
  radio.setDataRate(RF24_250KBPS); //reduce speed to emprove signal strength
  radio.openWritingPipe(pipe); // Get NRF24L01 ready to transmit
}

void loop(void) {
  msg[0] = (TRANSMITTER_INDEX);
  radio.write(msg, sizeof(msg)); // Send value through NRF24L01
  delay(1000);
}
