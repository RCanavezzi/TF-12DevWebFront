import jwt from 'jsonwebtoken';

export default function JwtVerifyApiMiddleware(request, response, next) {

    const getToken = () => {
        let token = request.cookies?.token ?? null;

        if (token !== null) {
            return token;
        }

        const authHeader = request.headers['authorization'];

        token = request.cookies?.token;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        return authHeader.split(' ')[1];

    }

    const token = getToken();

    if (token === null) {
        return response.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = userDecoded;
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return response.status(401).json({ error: 'Token expirado' });
        } else if (err.name === 'JsonWebTokenError') {
            return response.status(401).json({ error: 'Token inválido' });
        } else {
            return response.status(401).json({ error: 'Erro' });
        }

    }

}