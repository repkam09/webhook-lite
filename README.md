# webhook-lite
A stripped out fork of project lifeforce


This project is a lightweight GitHub Webhook handler for triggering a shell script if a webhook comes in.
The config file can specify a different shell script for any repository


# Setup
- Clone this repository on your system
- Run an 'npm install' from the repository directory to pull down required packages
- Create your config file and shell scripts
- Use 'screen' or a project like 'pm2' to keep this service running in the background
- The built in deploy.sh script should get you started as an example


# Example Config
- If we wanted to write a webhook-lite config for this repository we would use something like the below example:
- Note that the log location can be customized in the logging object block


config.json example:
```json
{
    "webhooks": {
        "webhook-lite": {
            "path": "/home/user/webhook-lite/",
            "script": "deploy.sh"
        }
    },
    "logging": {
        "debugmode": true,
        "logpath": "/home/user/webhooklog.txt"
    }
}
```


