import { Router } from 'express';
import ListController from '../app/Http/Controllers/User/Api/ListController.js';
import GetController from '../app/Http/Controllers/User/Api/GetController.js';
import CreateController from '../app/Http/Controllers/User/Api/CreateController.js';
import UpdateController from '../app/Http/Controllers/User/Api/UpdateController.js';
import DeleteController from '../app/Http/Controllers/User/Api/DeleteController.js';
import UploadPhotoController from '../app/Http/Controllers/User/Api/UploadPhotoController.js';
import VerifyImage from '../app/Http/Middlewares/VerifyImage.js';

export const apiUser = (function () {

    const router = Router();

    // GET Listar
    router.get('/', ListController);

    // GET Obter
    router.get('/:id', GetController);

    // POST Inserir
    router.post('/', CreateController);

    // PUT Atualizar
    router.put('/:id', UpdateController);

    // DELETE Excluir
    router.delete('/:id', DeleteController);

    // Enviar imagem
    router.post('/image', VerifyImage, UploadPhotoController);

    return router;

})();