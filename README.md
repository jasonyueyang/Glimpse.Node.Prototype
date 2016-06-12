#Welcome to Glimpse for Node.js!

## What is Glimpse?
This is a prototype for a [Glimpse](http://getglimpse.com/) implementation for the node.js development stack.  Glimpse is a request-level debugging tool that is is intended to 
provide real-time diagnostics & insights.  It was originally authored for .net, and we'd like to bring a similar offering to the Node.js community.  

## Why Glimpse for Node?
Glimpse is quite popular amongst .net developers, and we're exploring what it means to bring analogous functionality to Node.js. 

## Getting Started
*Very Rough Instructions*: 

1. We're currently running Node version 5.3.0.  If you encounter problems on other versions of Node, please open an issue.    
2. Clone the [Glimpse Node.js prototype](https://github.com/Glimpse/Glimpse.Node.Prototype).
3. Run npm install in the following directories:
  * <root>\src\glimpse.agent
  * <root>\src\glimpse.server 
  * <root>\samples\express.test.app
4. cd to Glimpse.Node.Prototype/express.test.app and run "node ./bin/www"
5. Open the express app in your browser at [http://localhost:3000/](http://localhost:3000/). 
6. Click around the page, and you'll generate some messages that will get stored in the .net server.
7. Note the Glimpse *Heads Up Display* (HUD) that appears in the bottom of your browser window. 
8. Point your browser at [http://localhost:3000/glimpse/client/index.html](http://localhost:3000/glimpse/client/index.html) to see all requests. 
9.  Click on each request to see its details.
10. Click on [http://localhost:3000/glimpse/message-history/?types=begin-request,end-request](http://localhost:3000/glimpse/message-history/?types=begin-request,end-request) 
to see the raw message history in json format.    

