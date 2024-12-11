const jwt = require('jsonwebtoken');

function checkRole(allowedRoles) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (allowedRoles.includes(decoded.rol_idRol)) {
                req.user = decoded;
                next();
            } else {
                return res.status(403).json({ message: 'Acceso denegado' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    };
}

module.exports = checkRole;