const fs                = require('fs');
const url               = require('url');
const http              = require('http');
const { parse }         = require('querystring');
const { PORT }          = require('./config/config.js');
const router            = require('./router.js');



var loginPage = function() {
    return 'login page ))'
}


var registerPage = function() {
    return 'register page ..'
}


console.log(`server works on ${PORT}`);
http.createServer((request, response) => {
    // router
    let responseStr = router.getResponseForRequest(request);
    response.end(responseStr);
    return;


}).listen(PORT);

