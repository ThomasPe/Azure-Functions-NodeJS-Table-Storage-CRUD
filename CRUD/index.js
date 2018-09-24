module.exports = function (context, req) {
    const res = context.res;
    const id = req.params.id;
    context.log("id: " + id);

    switch (req.method) {
        case 'GET':
            if (id) {
                getOneItem(req, res, id);
            } else {
                getAllItems(req, res);
            }
            break;

        case 'POST':
            insertItem(req, res);
            break;

        case 'PUT':
            replaceItem(req, res, id);
            break;

        case 'DELETE':
            deleteItem(req, res, id);
            break;

        default:
            res.status(405).json({ error: "Operation not supported", message: `Method ${req.method} not supported` })
    }
};

function getOneItem(req, res, id) {
    res.status(200).json({ id: id, message: "getOne" });
}

function getAllItems(req, res) {
    res.status(200).json({ query: req.query, message: "getAll" });
}

function insertItem(req, res) {
    res.status(200).json({ body: req.body, message: "insert" });
}

function replaceItem(req, res, id) {
    res.status(200).json({ body: req.body, id: id, message: "replace" });
}

function deleteItem(req, res, id) {
    res.status(200).json({ id: id, message: "delete" });
}