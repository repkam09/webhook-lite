#!/bin/bash

# stop the running service
pm2 delete webhooklite

# Switch into MIS project directory
cd ~/webhook-lite/

# Run all the git updates for this repository
git status 
git stash -u
git checkout master
git pull

# Add any npm packages
npm install

# Copy in new release
pm2 flush
pm2 start webhooklite.js --name webhooklite

# Print out the git log that was pushed
git log -n 1