// app.js - Aplicación web con base de datos
const express = require('express');
const { Pool } = require('pg');

// ¿Qué es PostgreSQL (pg)?
// PostgreSQL es una base de datos relacional muy popular
// 'pg' es el driver oficial de Node.js para conectarse a PostgreSQL
const app = express();

// Configuración de la base de datos
// Nota: 'db' es el nombre del servicio que definiremos en docker-compose
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db', // 'db' es el nombre del contenedor
  database: process.env.DB_NAME || 'miapp',
  password: process.env.DB_PASS || 'mipassword',
  port: process.env.DB_PORT || 5432,
});

// Función para inicializar la base de datos
async function initDB() {
  try {
    // Crear tabla de visitantes si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitantes (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address INET
      )
    `);
    console.log('✅ Base de datos inicializada');
  } catch (err) {
    console.error('❌ Error inicializando BD:', err);
  }
}

// Puerto donde va a correr nuestra aplicación
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static('public'));

// Ruta principal - ahora con base de datos
app.get('/', async (req, res) => {
    try {
        // Registrar la visita
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        await pool.query('INSERT INTO visitantes (ip_address) VALUES ($1)', [clientIP]);
        
        // Contar total de visitas
        const result = await pool.query('SELECT COUNT(*) as total FROM visitantes');
        const totalVisitas = result.rows[0].total;
        
        // Obtener últimas 5 visitas
        const ultimasVisitas = await pool.query(
            'SELECT timestamp, ip_address FROM visitantes ORDER BY timestamp DESC LIMIT 5'
        );

        res.send(`
            <html>
                <head>
                    <title>Mi App Docker + PostgreSQL</title>
                    <style>
                        body { 
                            font-family: Arial; 
                            text-align: center; 
                            margin: 50px; 
                            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .container { 
                            background: rgba(255,255,255,0.1); 
                            padding: 40px; 
                            border-radius: 15px; 
                            backdrop-filter: blur(10px);
                        }
                        .stats {
                            background: rgba(255,255,255,0.1);
                            margin: 20px 0;
                            padding: 20px;
                            border-radius: 10px;
                        }
                        .visit-list {
                            text-align: left;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🐳 ¡Hola desde Docker + PostgreSQL!</h1>
                        <p>Esta aplicación usa múltiples contenedores</p>
                        
                        <div class="stats">
                            <h3>📊 Estadísticas</h3>
                            <p><strong>Total de visitas:</strong> ${totalVisitas}</p>
                            <p><strong>Puerto:</strong> ${PORT}</p>
                            <p><strong>Hora del servidor:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div class="stats">
                            <h3>🕐 Últimas 5 visitas</h3>
                            <div class="visit-list">
                                ${ultimasVisitas.rows.map(visit => 
                                    `<p>📍 ${visit.timestamp.toLocaleString()} - IP: ${visit.ip_address}</p>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <p><small>🔄 Recarga la página para ver el contador aumentar</small></p>
                    </div>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Error en ruta principal:', err);
        res.status(500).send(`
            <h1>❌ Error de conexión</h1>
            <p>No se pudo conectar a la base de datos</p>
            <p>Error: ${err.message}</p>
        `);
    }
});

// Ruta de salud - ahora verifica la BD también
app.get('/health', async (req, res) => {
    try {
        // Probar conexión a la base de datos
        const result = await pool.query('SELECT NOW()');
        
        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
            db_time: result.rows[0].now
        });
    } catch (err) {
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: err.message
        });
    }
});

// Inicializar la base de datos y luego el servidor
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🗄️  Base de datos: PostgreSQL`);
    });
});