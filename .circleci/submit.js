#!/usr/bin/env node

const { exec } = require('child_process');
const https = require('https');
exec('npm test | grep -E \"[0-9]+\\s(passing|failing)\"', (err, stdout1, stderr) => {
  if (err) {
    return;
  }

  exec('echo "$aws_lambda_apikey"', (err, apikey) => {
    exec('echo "\n\n$CIRCLE_PR_USERNAME\n$CIRCLE_REPOSITORY_URL\n"', async (err, stdout2) => {
      console.log(`${stdout1}${stdout2}`);
      
      const options = {
        host: '3921zr9vkg.execute-api.ap-northeast-2.amazonaws.com',
        path: '/default/getTestCaseResult',
        method: 'POST',
        headers: {
          'x-api-key': apikey
        }
      };
      
      var ret = await new Promise((resolve, reject) => {
        
        const req = https.request(options, (res) => {
          res.on('data', (chunk) => {
            console.log('ok');
            resolve(chunk.toString());
            // callback(null, result);
          });
        });
        
        req.on('error', (e) => {
          console.log('error');
          reject();
          // callback(new Error('failure'));
        });
        
        // send the request
        req.write(JSON.stringify({
          'log': stdout1 + stdout2
        }));
        req.end();
        
      });
    });
  });
});
