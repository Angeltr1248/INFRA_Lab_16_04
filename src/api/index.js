const http = require("http");
const { Client } = require("pg");

// Configuración de conexión
const client = new Client({
  user: 'almacen_user',
  host: 'postgres_db', // Nombre del contenedor en la red de Docker
  database: 'inventario_db',
  password: 'supersecretpassword123',
  port: 5432,
});

client.connect().catch(err => console.error("Error de conexión a DB:", err));

const server = http.createServer(async (req, res) => {
  // Manejo de la ruta de prueba de base de datos
  if (req.url === '/api/test') {
    try {
      const result = await client.query('SELECT NOW() as tiempo_bd');
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ 
        estado: "Integración Exitosa", 
        db_time: result.rows[0].tiempo_bd 
      }));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else {
    // Ruta por defecto
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hola mundo! Un saludo");
  }
});

server.listen(3000, "0.0.0.0", () => console.log("API escuchando en puerto 3000"));