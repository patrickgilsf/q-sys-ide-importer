import net from 'net';
import {
  UN,
  Pin
} from './config.js';
import init from "../lib/init.json" assert { type: "json"};
import fs from "fs";

//null termination
const nt = "\u0000";

//time delay
const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

const login = () => {
  return UN && Pin
  ?
  JSON.stringify({
    "jsonrpc": "2.0",
    "method": "Logon",
    "params": {
      "User": UN,
      "Password": Pin
    }
  })
  :
  false;
};

const addCode = (code) => {
  return JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1234,
    "method": "Component.Set", 
    "params": {
      "Name": init.component,
      "Controls": [
        {
          "Name": "code", 
          "Value": code
        }
      ]
    }
  })
}


const main = async () => {

  //read lua from "../lua/Import.lua"
  fs.readFile("./lua/import.lua", "utf-8", (err, data) => {

    if (err) {
      console.log(`Error importing Import.lua with error: ${err}`)
    } else {

      //open up connection to Q-Sys core
      let client = new net.Socket();
      client.connect(1710, init.coreIP, async () => {

        //login, if you have credentials in .env file
        login() ? client.write(login() + nt) : null;

        //upload data to text controller
        client.write(addCode(data) + nt);

        //print feedback
        client.on('data', (d) => {
          console.log(`Received data from QRC API: ${d}`);
        });

        //close if server closes
        client.on('close', function() {
          console.log('Connection closed');
          client.end();
        });

        //close automatically after 3 seconds
        await timeoutPromise(3000);
        client.end();
      })
    }
  })
}

export {
  main
}
