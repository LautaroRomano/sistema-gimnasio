const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'sistema-gimnasio',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

