import express from 'express';

import web from './web.js';
import fileUpload from 'express-fileupload';
import CorsMiddleware from '../app/Http/Middlewares/CorsMiddleware.js';
import LoginController from '../app/Http/Controllers/Api/LoginController.js';
import path from "path";
import ejsMate from "ejs-mate";
import cookieParser from 'cookie-parser';
import JwtVerifyApiMiddleware from '../app/Http/Middlewares/JwtVerifyApiMiddleware.js';
import { apiUser } from './apiUser.js';
import { apiProduct } from './apiProduct.js';

export default (function () {

    const app = express();

    /** Usado para servir json */
    app.use(express.json());

    /** Usado para pode utilizar cookies */
    app.use(cookieParser());

    /** Usado para usar view, com a lib ejs */
    app.engine("ejs", ejsMate)
    app.set("view engine", "ejs");
    app.set("views", path.join(process.cwd(), "resources/views"));

    app.use(express.urlencoded({ extended: true }));

    app.use(fileUpload());

    // Login
    app.post("/login", CorsMiddleware, LoginController);

    //Users
    app.use("/api/users", CorsMiddleware, JwtVerifyApiMiddleware, apiUser);

    //Products
    app.use("/api/products", CorsMiddleware,/* JwtVerifyApiMiddleware,*/ apiProduct);

    //// Views
    app.use('/', web);

    /** Se nenhuma rota for encontrada, 404 neles! */
    app.use((request, response) => {
        response.status(CONSTANTS.HTTP.NOT_FOUND).json({ error: "Not found" });
    });

    return app;

})();
