const si = require('systeminformation');
const macaddress = require('macaddress');
const axios = require('axios');
const wifi = require('node-wifi');

// Initialize wifi
wifi.init({ iface: null });

// Replace with your server endpoint
const SERVER_URL = 'http://localhost:3000/api/token';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU3lzdGVtSW5mb0FnZW50IiwiaWF0IjoxNzQ4NTg4NDExLCJleHAiOjE3NDkxOTMyMTF9.4ZitBKtDRYBUo1oikMlsF0dSr-1ZR8v1f3N--SWF5Fs';

await axios.post(SERVER_URL, data, {
  headers: { Authorization: TOKEN }
});

// Fetch system info
async function getSystemInfo() {
  try {
    const [macs, system, osInfo, cpu, mem, disk, wifiList, ipRes] = await Promise.all([
      macaddress.all(),
      si.system(),
      si.osInfo(),
      si.cpu(),
      si.mem(),
      si.diskLayout(),
      wifi.scan(),
      axios.get('https://api.ipify.org?format=json'),
    ]);

    const data = {
      publicIP: ipRes.data.ip,
      macAddresses: macs,
      system,
      osInfo,
      cpu,
      mem,
      disk,
      wifiList,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending data:', data);

    // Send data to server
    await axios.post(SERVER_URL, data);

    console.log('Data sent successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run every 5 minutes
setInterval(getSystemInfo, 1 * 60 * 1000);
getSystemInfo(); // Run immediately on start
