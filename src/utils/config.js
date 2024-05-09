const fs = require('fs');
const yaml = require('js-yaml');
const { log } = require("./logger");

module.exports = class Config {
    static read() {
        try {
            const configFile = fs.readFileSync('./config.yml', 'utf8');
            
            const config = yaml.load(configFile);

            return config;
        } catch (error) {
            log('Error reading configuration file', "error");
            console.error(error);

            return {};
        }
    }
}
