const https = require('https');

const options = {
  hostname: 'hyreioguywfcnnviezim.supabase.co',
  path: '/rest/v1/promos?select=promo_name,price&limit=5',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cmVpb2d1eXdmY25udmllemltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Nzg3MDYsImV4cCI6MjA5MDQ1NDcwNn0.fesf4axb1XPItw6kvipu2O8P_HDtTW-p0xA-pde-hDo',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cmVpb2d1eXdmY25udmllemltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4Nzg3MDYsImV4cCI6MjA5MDQ1NDcwNn0.fesf4axb1XPItw6kvipu2O8P_HDtTW-p0xA-pde-hDo'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
