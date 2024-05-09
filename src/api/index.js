const { exec } = require('child_process');
const config = require("../utils/config").read();

module.exports = {
  name: "/",
  run: async (req, res) => { 

      
      const payload = req.body;
      console.log(payload); // log

    if (payload && payload.ref === 'refs/heads/main') {
        log('Changes detected in the GitHub repository', "log");

        exec(`git -C ${config.path} pull origin ${config.branch}`, (error, stdout, stderr) => {
            if (error) {
                log("Error during code update.", "error");
                console.error(error);
                
                return;
            }

            log(`The code has been updated successfully.`, "log");
            console.log(stdout);

            /* Custom Event */
            if(Boolean(config.event.enable) == true) {

                /* Custom Command */
                if(config.event.type == "custom-command") {
                    exec(config.event.command, (error, stdout, stderr) => {
                        if (error) {
                            log(`Error during execution of custom command`, "error");
                            console.error(error);

                            return;
                        }

                        log("Command executed successfully:");
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