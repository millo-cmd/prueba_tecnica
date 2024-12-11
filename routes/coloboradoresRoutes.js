const express = require('express');
const router = express.Router();
const db = require('../database/db');

const checkRole = require('../middleware/middlewareauth');

router.post('/registratColaborador', checkRole([1]), (req, res) => {
    const { nombre, apellido, direccion, edad, profesion, estadocivil } = req.body;
    if(!nombre || !apellido || !edad){
        return res.status(400).json({ mensaje: 'Nombre, apellido y edad son obligatorios' });
    } else if( edad < 0 ){
        return res.status(400).json({ mensaje: 'La edad es incorrecta, debe ser mayor a 0' });
    }

    const query = 'CALL sp_agregar_colaborador(?, ?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido, direccion, edad, profesion, estadocivil], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, nombre, apellido, direccion, edad, profesion, estadocivil });
    });
});

router.get('/', (req, res) => {
    const query = 'CALL sp_mostrar_colaborador';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM items WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ error: 'Item no encontrado' });
        res.status(200).json(results[0]);
    });
});

router.put('/editarColaborador/:id', checkRole([1]), (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, direccion, edad, profesion, estadocivil } = req.body;
    const query = 'CALL sp_editar_colaborador(?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [id, nombre, apellido, direccion, edad, profesion, estadocivil], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item no encontrado' });
        res.status(200).json({ id, nombre });
    });
});

router.delete('/eliminarColaborador/:id', checkRole([1]), (req, res) => {
    const { id } = req.params;
    const query = 'CALL sp_eliminar_colaborador(?)';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item no encontrado' });
        res.status(200).json({ message: 'Item eliminado exitosamente' });
    });
});

module.exports = router;
