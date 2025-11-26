import ProductModel from "../../../../Models/ProductModel.js";

export default async function ListProductController(request, response) {

    const HTTP_STATUS = CONSTANTS.HTTP;

    const ALLOWED_ORDER_FIELDS = ["id", "name"];

    const ALLOWED_ORDER_DIRECTION = ["asc", "desc"];

    const limit = parseInt(request.query.limit) || 100;
    const offset = parseInt(request.query.offset) || 0;
    const orderBy = request.query.orderBy || "id,asc";

    const [orderField, orderDirection] = orderBy.split(",");

    if (!ALLOWED_ORDER_FIELDS.includes(orderField)) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Campo Order By incorreto: ${orderField}.` });
    }

    if (!ALLOWED_ORDER_DIRECTION.includes(orderDirection)) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Direção Order By incorreto: ${orderDirection}.` });
    }


    if (limit > CONSTANTS.MAX_GET_LIMIT) {
        return response.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Limit máximo: ${CONSTANTS.MAX_GET_LIMIT}.` });
    }

    try {

        const { rows, count } = await ProductModel.findAndCountAll({
            limit: limit + 1,
            offset: offset,
            order: [[orderField, orderDirection]]
        });

        const hasMore = (rows.length > limit);

        const data = (hasMore) ? (rows.slice(0, limit)) : (rows);
        const next = (hasMore) ? (offset + limit) : (null);

        return response.status(HTTP_STATUS.SUCCESS).json({
            rows: data,
            count: count,
            limit: limit,
            next: next,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.max(1, Math.ceil(count / limit))
        });

    } catch (error) {
        console.log(error);
        return response.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Error de servidor.' })
    }

};
