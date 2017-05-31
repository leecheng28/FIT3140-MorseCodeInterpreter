# FIT3140 Assignment 5. Team 29.

## Project Description ##
In this project, we will implement "version 0.1" of the Morse Code Interpreter app, using Firebase and Johnny-five library. Morse code interpreter is a method of transmitting text information as a series of on-off tones, lights, or clicks that can be directly understood by a skilled listener or observer. (Wikipedia) 

Our morse code interpreter app is initialized by a server and controlled by a web control panel "Morse code decoder". On the **server** side, a server user can send messages by making a series of long and short signals. The signals are triggered by pressing "Enter/Return" keyboard key. And the signal's type is determined by server-side user's timing. On the **web** control panel, a client user can start/end the decoding process by switching on/off a toggle button. Once the decoding process is on(i.e. the toggle button is switched on), a client user can receive encoded and decoded messages from server side. 

For more information about morse code, please refer to [here](https://en.wikipedia.org/wiki/Morse_code).

For more details about this project, please read the [Assignment 5 specification](https://github.com/FIT3140-S1-2017/assignment-5-team29/raw/master/Docs/FIT3140Assignment5%20MorseCodeDecoder.pdf) and [iteration 2 goals](https://github.com/FIT3140-S1-2017/assignment-5-team29/blob/master/Docs/Assignment5%20Iteration2.pdf)

# Iteration 1 #
## Iteration Description ##
This is the first iteration of assignment 5, we have a list of user stories to implement. Among these, we need to unit test two user stories. They are, 
1) As an app user, I want the server to determine whether the incoming message is long or short.
2) As an app user, I want to decode the motion sensor messages to be decoded into English letters based on Morse code coding table.

Each user story test is made up of simple test cases (normal program behavior), error test cases (program behavior upon accepting wrong inputs) and complex test cases (if applicable). 
The Mocha testing framework is used to implement the test cases.

For more information about tests, please see the test plan [here](https://github.com/FIT3140-S1-2017/assignment-5-team29/raw/master/Docs/TestPlans.pdf).

## Run the program ##
Clone the repository.
```bash
git clone https://github.com/FIT3140-S1-2017/assignment-5-team29
```
Move into Program subdirectory.
```bash
cd assignment-5-team29/Program
```
Install all required dependencies
```bash
npm install
```
Run two tests in one go
```bash
./node_modules/mocha/bin/mocha
```
# Iteration 2 #
## Iteration Description ##
This is the second iteration of assignment 5, we have a priortized list of goals. They are, 
1) Add support for numeric digits (0..9), punctuations marks available for morse code (?@-$...). 
2) Stop the process at the server side if the Prosign ‘SK, End of transmission’ (SSSLSL) occurs.
3) Polish the client side interface (web page).
4) Allow the client side to stop and start the transmission process.

## Run the program ##
0. Open up Terminal.app

1. If you have not cloned this repository yet, this helps you set up the iteration 2 programs
```bash
git clone https://github.com/FIT3140-S1-2017/assignment-5-team29
cd assignment-5-team29/Program
npm install
npm install -g webpack-dev-server
webpack-dev-server
```

2. To run with virtual arduino device
```bash
node server.js virtual
```

(alternatively)To run with physical arduino device
```bash
node server.js 
```

3. In your browser, copy and paste "localhost:3333" into your broswer address bar. Hit "Enter/Return".

4. In your terminal, send messages by pressing "Enter/Return" key. Follow the on-screen instructions for sending more messages.

Have fun!

Note. If you have problems configuring your physical arduino device, please refer to "Hardware Structure" [here](https://github.com/FIT3140-S1-2017/assignment-3-team29). 

# Who do I talk to? #
Further issues, please contact
* Li at `cl745524836ATgmail.com`




