export default function CorsMiddleware(request, response, next) {
    const domain = "http://localhost:5173";

    response.header("Access-Control-Allow-Origin", domain);
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.header('Access-Control-Allow-Credentials', 'true');

    // Navegadores mandam uma requisição OPTIONS antes de POST/PUT/DELETE
    if (request.method === "OPTIONS") {
        return response.sendStatus(200);
    }

    return next();
};
