const { parse }         = require('querystring');
const bodyParser        = require('body-parser');
const rsa               = require('./controllers/rsa/rsa.js');
const index             = require('./controllers/index/index.js');
const login             = require('./controllers/login/login.js');


var parseParams = function(paramsStr){
    const paramsList = paramsStr.split('&');
    let params = {};
    for (let i = 0; i < paramsList.length; i += 1) {
        let key = paramsList[i].split('=')[0];
        let val = paramsList[i].split('=')[1];
        params[key] = val;
    }
    return params;
}

var collectRequestData = function(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            console.log('body ended');
            console.log(parse(body));
            callback(parse(body));
        });
    } else {
        // callback(null);
        console.log('not www form urlencoded')
    }
}

exports.getResponseForRequest = function(request) {
    console.log(request.method, request.url);
    if (request.method == 'GET') {
        
            let url = '';
            let params = {};
            if (request.url.indexOf('?') > -1) {
                url = request.url.split('?')[0];
                params = parseParams(request.url.split('?')[1]);
            } else {
                url = request.url;
            }
        
        switch (url) {
            case '/index':
                return index.index();
    
            case '/login':
                return login.loginPage();
    
            case '/register':
                return login.registerPage();
    
            case '/generate-keys':
                let keys = rsa.generateKeysSyncPage();
                console.log(keys)
                return 'keys generated (you can check in config/keys.json)';
    
            case '/get-keys':
                let getKeysRes = rsa.getKeysPage();
                return getKeysRes;
    
            case '/encrypt':
                let messageToEncrypt = params.message || 'sample message';
                let encryptRes = rsa.encryptPage(messageToEncrypt);
                return encryptRes;
    
            case '/decrypt':
                let messageToDecrypt = params.message || encrypt('sample message');
                let decryptRes = rsa.decryptPage(messageToDecrypt);
                return decryptRes;
        }
        return 'method: GET\n[ERROR 404]\nroute not found!';
    } else {
        let postData = {};
        let requestBody = collectRequestData(request, function(parsedBody){
            console.log('in callback');
            postData = parsedBody;
        });
        console.log(postData);
        return 'POST';
    }
}