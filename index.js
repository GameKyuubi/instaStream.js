const args = process.argv.slice(2);
const OBSWebSocket = require('obs-websocket-js').default;
const config = require('config');
const owsConfig = config.get('obs-websocket');

const obs = new OBSWebSocket();

let options = {
  inputName: 'insta',
  inputKind: 'xcomposite_input',
  propertyName: 'capture_window',
}

obs.connect(owsConfig.url, owsConfig.password, identificationParams = {}).then((data) => {
  console.log("Connected to OBS");
  obs.call("GetInputSettings", options).then((results) => {
    console.log(results);
  }).then(() => {
    obs.call("GetInputPropertiesListPropertyItems", options).then((results) => {
      console.log("searching for " +args[0]);
      let target = results.propertyItems.filter(object => object.itemName===args[0]);
      if (target != undefined) {
        console.log("target found: " +target[0].itemValue);
        let settings = {
          inputName: 'insta',
          inputSettings: {
            capture_window: target[0].itemValue
          }
        }
        obs.call("SetInputSettings", settings, true).then((results) => {
          console.log("settings set");
          obs.disconnect();
        });
      } else {
        console.log("target not found");
        obs.disconnect();
      }
    });
  });
});
