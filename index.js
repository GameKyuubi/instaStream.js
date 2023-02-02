const OBSWebSocket = require('obs-websocket-js').default;
const config = require('config');
const owsConfig = config.get('obs-websocket');

const obs = new OBSWebSocket();
console.log("hello from JS");
obs.connect(owsConfig.url, owsConfig.password, identificationParams = {}).then((data) => {
  console.log(data);
  obs.disconnect();
});
