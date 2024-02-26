const db = require('../database');

function verificarToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    // Verificar se o token está presente no banco de dados
    db.query('SELECT * FROM tokens WHERE token = ?', [token], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(401).json({ message: 'Token não encontrado no banco de dados' });
        }

        next();
    });
}

module.exports = verificarToken;