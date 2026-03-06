const { exec } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'cgs_keep_alive.js');

console.log("CGS Session Keeper started...");
console.log("Will run every 12 minutes to prevent timeout.");

function runKeepAlive() {
    console.log(`\n[${new Date().toLocaleTimeString()}] Running Keep-Alive ping...`);
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }
        console.log(stdout.trim());
    });
}

// Run once immediately
runKeepAlive();

// Set interval (12 minutes - 720,000 ms)
// Sessions usually timeout at 15-20 minutes
setInterval(runKeepAlive, 720000);
