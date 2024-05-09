const express = require('express');
const { readdirSync } = require('fs');
const config = require("./utils/config").read();
const app = express();
const { join } = require('path');
const { log } = require("./utils/logger");

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

let port = config.read().port;

app.listen(port, () => {
    log(`Listening on ${port} port`, "ready");
});
