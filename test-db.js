const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => {
    console.log("Connected successfully to pooled URL!");
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error("Connection error with pooled URL", err.message);
    
    // Try direct URL
    const clientDirect = new Client({
      connectionString: process.env.DIRECT_URL
    });
    clientDirect.connect()
      .then(() => {
        console.log("Connected successfully to DIRECT URL!");
        return clientDirect.query('SELECT NOW()');
      })
      .then(res => {
        console.log(res.rows);
        clientDirect.end();
      })
      .catch(err2 => {
        console.error("Connection error with DIRECT URL", err2.message);
        clientDirect.end();
      });
  });
