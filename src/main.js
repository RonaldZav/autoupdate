const express = require('express');
const { readdirSync } = require('fs');
const config = require("./utils/config").read();
const app = express();
const { join } = require('path');
const { log } = require("./utils/logger");

const fs = require('fs');

const configFile = 'config.yml';
const defaultConfig = `
    port: 2008
    secret: "your_repository_secret"
    path: /home/ronaldzav/my_repo
    private: true
    tree: main

    # Required for private repositories
    account: 
    user: ronaldzav
    token: your_token

    event:
    enable: true
    type: custom-command
    command: service your_service_name restart
    finish_command: yarn`;

fs.access(configFile, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(configFile, defaultConfig, (err) => {
      if (err) {
        log('Error creating config.yml', "error");
        console.error(err);
      }
    });
  }
});


app.use(express.json());

const ad = join(__dirname, 'api');
const efs = readdirSync(ad).filter(file => file.endsWith('.js'));

efs.forEach((ef) => {
    try {
        const api = require(join(ad, ef));
        
        app.post(api.name, (req, res) => {
            api.run(req, res);
        })

    } catch (error) {
        log(`Error loading /src/api/${ef}:`, "error");
        console.log(error);
        
    }
});

let port = config.port;

app.listen(port, () => {
    log(`Listening on ${port} port`, "ready");
});
