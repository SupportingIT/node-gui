var ClipAgent = require ('./agent.js').ClipAgent;
var Clipboard = require ('clipboard').Clipboard;
var options = require ('./options.js');
var config = options.config;

var agent = new ClipAgent ();
var clipboard = new Clipboard ();

if (config.token) {
    // Auto login
    agent.autoLogin (config.token);
} else if (config.first_time_using) {
    // Prompt for registing
} else {
    // Prompt for username and password
    agent.login ('fool', '1234');
}

agent.on ('login', function () {
    // Remember token after login
    config.token = agent.token;
    options.save ();

    // Begin monitoring clipboard after login
    clipboard.on ('copy', function (data) {
        agent.copy ({
            'type': 'text',
            'data': data
        });
    });
});

agent.on ('paste', function (clip) {
    clipboard.paste (clip.data);
});

agent.on ('error', function (message) {
    console.log (message);
    process.exit (0);
});

process.on ('SIGINT', exit);

// Hook to clean everything when exiting
function exit () {
    // Send logout infomation
    agent.destroy ();

    process.exit (0);
//    setTimeout (function () { process.exit (0); }, 1000);
}
