#Welcome to Glimpse for Node.js!

## What is Glimpse?
This is a prototype for a [Glimpse](http://getglimpse.com/) project for the node.js development stack.  Glimpse is a .net request-level debugging tool that is is intended to provide real-time
diagnostics & insights.  

## Why Glimpse for Node?
Glimpse is quite popular amongst .net developers, and we're exploring what it means to bring analogous functionality to Node.js. 

## Getting Started
*Very Rough Instructions*: 
At this time, you need to run the .net Glimpse.V2 prototype.  We're working to eliminate this dependency. 

1. Clone the [Glimpse V2 git repository](https://github.com/Glimpse/Glimpse.Prototype). 
2. Clone the [Glimpse Node.js prototype](https://github.com/Glimpse/Glimpse.Node.Prototype).
3. Open the Glimpse.sln file in Visual Studio 2015 & run the solution by typing "f5".  
4. cd to Glimpse.Node.Prototype/express.test.app and run "npm start"
5. Open the express app in your browser at [http://localhost:3000/](http://localhost:3000/). 
6. Click around the page, and you'll generate some messages that will get stored in the .net server.
7. View the message history by going to [http://localhost:5000/glimpse/MessageHistory](http://localhost:5000/glimpse/MessageHistory)
