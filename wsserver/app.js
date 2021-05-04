const express = require("express");

const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: server });

let executeCommand = (command,callback) => {
  const { spawn } = require("child_process");
  let params = command.split(" ");
  command_part = params[0];
  params.shift();
  console.log(params);
  const executedCommand = spawn(command_part, params);
  let output = "";

  executedCommand.stdout.on("data", data => {
    output += data.toString();
  });

  executedCommand.stderr.on("data", data => {
    console.log("Stderr...");
    console.log(`stderr: ${data}`);
    output += "Error";
  });

  executedCommand.on('error', (error) => {
    console.log("Error...");
    console.log(`error: ${error.message}`);
    output += "Error";
  });

  executedCommand.on("close", code => {
    console.log("Close...");
    console.log(`child process exited with code ${code}`);
    console.log(output);
    callback(output,code);
  });

}

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.clients.forEach(function each(client) {
      //not send message if server and client is not same
      //if (client !== ws && client.readyState === WebSocket.OPEN) {
      executeCommand(message, function(output, exit_code) {
          console.log("Process Finished.");
          console.log('closing code:' + exit_code);
          console.log('Output:',output);
          client.send(output)
      });
      //}
    });

  });
});


//routes
app.get('/', (req, res) => {
  res.send("Hello");
});

//listen
server.listen(3000, () => console.log("Listening 3000..."));