const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const colaboradoresRoutes = require('./routes/coloboradoresRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes desde tu cliente React
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  }));

app.use('/colaboradores', colaboradoresRoutes);
app.use('/usuarios', usuariosRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
