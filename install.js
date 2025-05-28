const Service = require('node-windows').Service;

const svc = new Service({
  name: 'System Info Agent',
  description: 'Collects system information and sends it to the server.',
  script: require('path').join(__dirname, 'index.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.on('install', () => {
  console.log('Service installed!');
  svc.start();
});

svc.on('alreadyinstalled', () => console.log('Service already installed.'));
svc.on('start', () => console.log('Service started.'));
svc.install();

