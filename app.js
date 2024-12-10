const express = require('express');
const bodyParser = require('body-parser');
const colaboradoresRoutes = require('./routes/coloboradoresRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/colaboradores', colaboradoresRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
