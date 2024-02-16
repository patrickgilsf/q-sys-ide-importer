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

const addCode = (code, comp) => {
  return JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1234,
    "method": "Component.Set", 
    "params": {
      "Name": comp,
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

  //iterate through the named files
  console.log(`There are ${init.length} files to update...`);

  //open net connection
  let client = new net.Socket();

  //connect to core
  client.connect(1710, init.ip, async () => {

    //use login data to confirm login
    login() ? client.write(login() + nt) : console.log(`${init.name} is not authenticated`);
    
    //iterate through init.json
    init.imports.forEach((i) => {

      fs.readFile(`./lua/${i.file}`, "utf-8", (err, data) => {
        
        //handle file errors
        if (err) {
          console.log(`Error importing ${i.file} with error: ${err}`)
        } else {
          //add code here
          client.write(addCode(data, i.comp) + nt);
        }
      })
    });

    //print feedback
    client.on('data', (d) => {
      console.log(`Received data from QRC API: ${d}`);
    });

    client.on('close', () => {
      console.log('client closed');
      client.end();
    });

    //close socket automatically
    await timeoutPromise(3000);
    client.end();
  })
}

export {
  main
}
