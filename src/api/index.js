const { exec } = require('child_process');
const config = require("../utils/config").read();
const { log } = require("../utils/logger");

module.exports = {
  name: "/",
  run: async (req, res) => { 
      
      
      const tc = req.body.ref;
      const tree = tc.substring(11);
      
      if (req && tree === config.tree) {

        let git = `https://github.com/${req.body.repository.full_name}.git`;
        if(Boolean(config.private) == true) git = `https://${config.account.user}:${config.account.token}@github.com/${req.body.repository.full_name}.git`;

        log('Changes detected in the GitHub repository', "log");

        let cmd = `cd ${config.path} && if [ "$(ls -A)" ]; then git pull ${git}; else git clone ${git} . ; fi`
        if(config.finish_command) cmd = `${cmd} && ${config.finish_command}`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                log("Error during code update.", "error");
                console.error(error);
                
                return;
            }

            log(`The code has been updated successfully.`, "log");
            console.log(stdout);

            /* Custom Event */
            if(Boolean(config.event.enable) === true) {

                /* Custom Command */
                if(config.event.type === "custom-command") {
                    exec(config.event.command, (error, stdout, stderr) => {
                        if (error) {
                            log(`Error during execution of custom command`, "error");
                            console.error(error);

                            return;
                        }

                        log("Command executed successfully");
                        console.log(stdout);
                    });
                }
           } else {
                log(`Event type in config.yml is not recognized`, "warn");
           }

        });
    }

    res.status(200).end();

  }
}
