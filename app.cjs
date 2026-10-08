// @ts-nocheck
// start app via Phusion Passenger
// Files start_with_env.cjs and symlink app.js are used to start server on restricted servers that require single entry file.
// Cheap hosting small.pl requires this for server to run. If not used those files are safe to delete.
require("dotenv/config")                // Init .env manually to bypass nitro.js restrictions
require("./.output/server/index.mjs")   // Runs server compiled with nitro
