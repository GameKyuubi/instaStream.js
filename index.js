const args = process.argv.slice(2);
const OBSWebSocket = require('obs-websocket-js').default;
const config = require('config');
const owsConfig = config.get('obs-websocket');
const pipewire = require('node-pipewire');

const obs = new OBSWebSocket();

let options = {
  inputName: 'insta',
  inputKind: 'xcomposite_input',
  propertyName: 'capture_window',
}
console.log(pipewire);

// connect to obs
obs.connect(owsConfig.url, owsConfig.password, identificationParams = {}).then((data) => {
  console.log("Connected to OBS");
  obs.call("GetInputSettings", options).then((results) => {
    // console.log(results);
  }).then(() => {
    // get list of capturable windows
    obs.call("GetInputPropertiesListPropertyItems", options).then((results) => {
      console.log("searching for " +args[0]);
      // find the right one
      let target = results.propertyItems.filter(object => object.itemName===args[0]);
      if (target != undefined) {
        console.log("target found: " +target[0].itemValue);
        let settings = {
          inputName: 'insta',
          inputSettings: {
            capture_window: target[0].itemValue
          }
        }
        // set to target window
        obs.call("SetInputSettings", settings, true).then((results) => {
          console.log("settings set");
          obs.disconnect();
        }).then(() => { // connect pipewire nodes
          pipewire.createPwThread();
          setTimeout(() => {
            console.log(pipewire.getNodes());
          },1000);
          //pipewire.getNodes((nodes) => {
          //  console.log("nodes: " +nodes);
          //});
        });
      } else {
        console.log("target not found");
        obs.disconnect();
      }
    });
  });
});
