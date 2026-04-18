const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv('_mongodb._tcp.cluster0.ogxjfml.mongodb.net', (err, addresses) => {
  if (err) {
    console.error("SRV Lookup Error:", err.message);
  } else {
    console.log("SRV Addresses:", addresses);
  }
});

dns.resolve4('google.com', (err, addresses) => {
  if (err) {
    console.error("Standard Web DNS Error:", err.message);
  } else {
    console.log("Standard DNS Works:", addresses);
  }
});
