import ProductImageModel from "../../../../Models/ProductImageModel.js";

export default async function UploadPhotoController(request, response) {

    const arquivo = request.files.image;
    const idProduct = request.params.id;

    if (!idProduct) {
        return response
            .status(CONSTANTS.HTTP.NOT_FOUND)
            .json({ error: 'Produto não encontrado' });
    }

    const newName = `${idProduct}_${Date.now()}_${arquivo.name.replace(/\s+/g, '_')}`;

    const caminho = CONSTANTS.DIR + `/storage/images/products/${newName}`;

    const row = await ProductImageModel.create(
        {
            product_id: idProduct,
            relative_path: newName
        }
    );

    arquivo.mv(caminho, async (err) => {

        if (err) {

            await ProductImageModel.destroy({
                where: {
                    id: row.id
                }
            });

            return response
                .status(CONSTANTS.HTTP.SERVER_ERROR)
                .json({ error: 'Erro ao salvar arquivo' });
        }



        return response
            .json({
                image: newName
            });
    });

}