const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/db');

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { email, password  } = req.body;
        if (!email || !password ) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }
        
        const query = 'SELECT * FROM usuario WHERE correo = ?';
        db.query(query, [email], async (err, results) => {
            if(err){
                return res.status(500).json({ message: 'Error interno del servidor', error: err });
            }

            if(results.length === 0){
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const usuario = results[0];
            
            // Comparar contraseña encriptada
            const isMatch = await bcrypt.compare(password , usuario.password);
            
            if(!isMatch){
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                {
                    idUsuario: usuario.idUsuario,
                    rol_idRol: usuario.rol_idRol,
                    colaborador_idColaborador: usuario.colaborador_idColaborador
                }, 
                process.env.JWT_SECRET || 'gestor_app_project',
                {
                    expiresIn: '8h'
                }
            );
            
            return res.status(200).json({ 
                message: 'Login exitoso', 
                token 
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { colaborador_idColaborador, rol_idRol, correo, password } = req.body;
        if(!colaborador_idColaborador || !rol_idRol || !correo || !password){
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({ message: 'Formato de correo electrónico inválido' });
            }
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = 'CALL sp_agregar_usuario(?, ?, ?, ?)';
            const params = [
                colaborador_idColaborador, 
                rol_idRol, 
                correo, 
                hashedPassword
            ];

            db.query(query, params, (err, results) =>{
                if(err){
                    if(err.code === 'ER_DUP_ENTRY'){
                        return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
                    }
                    return res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
                }
                if(results.affectedRows > 0 || (results[0] && results[0].length > 0)){
                    return res.status(201).json({
                        message: 'usuario registrado exitosamente',
                        usuario: results.affectedRows
                    })
                }else{
                    return res.status(500).json({ message: 'No se pudo registrar el usuario' });
                }
            });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
})

module.exports = router;