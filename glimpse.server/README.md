#Glimpse for Node.js Server (Prototype)

This is a prototype for a Glimpse project for the Node.js development stack. [Glimpse](http://getglimpse.com/) is a request-level debugging tool that is intended to provide real-time diagnostics and insights.

##Installation

Clone this repository.

```javascript
> git clone https://github.com/Glimpse/Glimpse.Node.Prototype.git
```

##Use

Run the server test application.

```javascript
> cd Glimpse.Node.Prototype/glimpse.server
> npm install
> cd ../express.server.test.app
> npm install
> npm start
```

In another window, run the client test application.

```javascript
> cd Glimpse.Node.Prototype/glimpse.agent
> npm install
> cd ../express.test.app
> npm install
> npm start
```

Open a browser to [http://localhost:3000/](http://localhost:3000/).

Click around the page and you'll generate some messages stored by the server.

View the messages by opening a browser to [http://localhost:5000/glimpse](http://localhost:5000/glimpse) and clicking ['Launch Client'](http://localhost:5000/glimpse/client/index.html?metadataUri=%2Fglimpse%2Fmetadata).

##License

MIT
