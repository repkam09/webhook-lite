const log = require("../utils/logger");
const config = require("../config.json");
const exec = require('child_process').exec;

// Grab the webhook settings from the config json
const updaters = config.webhooks;

function addHandlers(server) {
    server.post("/api/github", (req, res, next) => {
        if (req.body) {
            var webhook = req.body;
            console.log("Raw Webhook: " + JSON.stringify(webhook));
            if (webhook.repository && webhook.commits && webhook.head_commit) {

                // Also check that the commit is on the 'develop' branch
                var repository = webhook.repository;
                var head = req.body.head_commit;

                var ref = webhook.ref;

                // turn the ref into the actual branch name
                var branch = "";
                var refparts = ref.split("/");

                if (refparts.length > 0) {
                    branch = refparts[refparts.length - 1];
                }

                log.info("Repository " + repository.name + " has been updated by " + head.author.name + " with message: " + head.message);
                if (updaters[repository.name]) {
                    var settings = updaters[repository.name];
                    log.info("Triggering redeploy for " + repository.name + " located at " + settings.path + " with script " + settings.script);
                    try {

                        // Create the string to execute
                        var command = settings.path + "/" + settings.script + " " + branch;
                        exec(command, { cwd: settings.path }, (error, stdout, stderr) => {
                            if (error) {
                                log.error("exec error: " + error);
                                return;
                            }

                            // Log these to the console only, not to log files
                            log.info("stdout: " + stdout);
                            log.error("stderr: " + stderr);
                        });
                    } catch (error) {
                        log.error("An error occurred while running redeploy script for " + repository.name);
                    }
                }
            } else {
                log.info("Got a webhook, but it did not match the known github format");
            }
            res.send(200);
        } else {
            res.send(400);
        }
    });

    server.get("/api/github", (req, res, next) => {
        res.send(200, "This endpoint is running!");
    });
}

/**
 * This set of properties defines this as a plugin
 * You must have an enabled, name, and start property defined
 */
module.exports = {
    enabled: true,
    name: "github webhook",
    start: (server) => {
        addHandlers(server);
    }
}
