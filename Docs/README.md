# FIT3140 Assignment 5 Iteration 1. Team 29.

## Project Description ##
In this project, we implement "version 0.1" of the Morse Code Interpreter app, using Firebase and Johnny-five library. 
This is the first iteration of assignment 5, we have a list of user stories to implement. Among these, we need to unit test two user stories. They are, 
1) As an app user, I want the server to determine whether the incoming message is long or short.
2) As an app user, I want to decode the motion sensor messages to be decoded into English letters based on Morse code coding table.

Each user story test is made up of simple test cases (normal program behavior), error test cases (program behavior upon accepting wrong inputs) and complex test cases (if applicable). 
The Mocha testing framework is used to implement the test cases.

For more information about tests, please see the test plan [here](https://github.com/FIT3140-S1-2017/assignment-5-team29/raw/master/Docs/TestPlans.pdf)

For more details about morse code, please read the [Assignment 5 specification](https://github.com/FIT3140-S1-2017/assignment-5-team29/raw/master/Docs/FIT3140Assignment5%20MorseCodeDecoder.pdf)

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

## Who do I talk to? ##

* Matthew at `mgrea2@student.monash.edu`
* Li at `lche206@student.monash.edu`




