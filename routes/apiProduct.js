import { Router } from 'express';
import ListProductController from '../app/Http/Controllers/Product/Api/ListProductController.js';
import CreateProductController from '../app/Http/Controllers/Product/Api/CreateProductController.js';
import DeleteProductController from '../app/Http/Controllers/Product/Api/DeleteProductController.js';
import UpdateProductController from '../app/Http/Controllers/Product/Api/UpdateProductController.js';
import GetProductController from '../app/Http/Controllers/Product/Api/GetProductController.js';
import VerifyImage from '../app/Http/Middlewares/VerifyImage.js';
import UploadPhotoController from '../app/Http/Controllers/Product/Api/UploadPhotoController.js';

export const apiProduct = (function () {

    const router = Router();

    router.get('/', ListProductController);

    router.get('/:id', GetProductController)

    router.post('/', CreateProductController);

    router.delete('/:id', DeleteProductController);

    router.put('/:id', UpdateProductController);

    // Enviar imagem
    router.post('/:id/image', VerifyImage, UploadPhotoController);

    return router;

})();