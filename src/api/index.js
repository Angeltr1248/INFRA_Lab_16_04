cat <<EOF > index.js
const http = require("http");
const { Client } = require("pg");

const client = new Client({
  user: 'almacen_user',
  host: 'postgres_db', // Gracias a la red de Terraform, usamos el nombre del contenedor
  database: 'inventario_db',
  password: 'supersecretpassword123',
  port: 5432, // Puerto interno del contenedor
});
client.connect().catch(console.error);

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Soluciona errores de CORS
  
  if (req.url === '/api/test') {
     try {
       const result = await client.query('SELECT NOW() as tiempo_bd');
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify({ estado: "Conectado a Postgres", bd: result.rows[0] }));
     } catch(e) {
       res.writeHead(500);
       res.end(JSON.stringify({ error: e.message }));
     }
  } else {
     res.writeHead(200, { "Content-Type": "text/plain" });
     res.end("Hola mundo! Un saludo");
  }
});

server.listen(3000, "0.0.0.0", () => console.log('API conectada'));
EOF