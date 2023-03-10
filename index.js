const args = process.argv.slice(2);
const OBSWebSocket = require('obs-websocket-js').default;
const config = require('config');
const owsConfig = config.get('obs-websocket');
const pipewire = require('node-pipewire');

const obs = new OBSWebSocket();
const obsPWSink = "PipeWire-OBS";

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
          console.log("Target window captured.");
          obs.disconnect();
        }).then(() => { // connect pipewire nodes
          pipewire.createPwThread();
          setTimeout(() => {
            let nodes = pipewire.getNodes();
            let source = nodes.filter(node => node.name===args[1]);
            let sink = nodes.filter(node => node.name===obsPWSink);
            let links = pipewire.getLinks();
            let obspwlinks = links.filter(link => link.input_node_id===sink[0].id);
            //delete links beforehand
            console.log("clearing sink links");
            for (let i = 0; i < obspwlinks.length; i++) {
              pipewire.unlinkPorts(obspwlinks[i].input_port_id, obspwlinks[i].output_port_id);
            }
            if (source[0] != undefined && sink[0] != undefined) {
              console.log("linking " +source[0].name+ " and " +sink[0].name);
              for (let i = 0; i < sink[0].ports.length; i++) {
                console.log("linking: "+source[0].ports[i].id+ " and " + sink[0].ports[i].id);
                pipewire.linkPorts(sink[0].ports[i].id, source[0].ports[i].id);
              }
            } else {
              console.log("Error linking audio: source, sink or both not found");
            }
          },100);
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
