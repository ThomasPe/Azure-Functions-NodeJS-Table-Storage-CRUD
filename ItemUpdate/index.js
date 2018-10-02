const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = "mytable";

module.exports = function (context, req) {
    context.log('Start ItemUpdate');

    if (req.body) {

        // TODO: Add some object validation logic
        const item = req.body;

        // Depending on how you want this to behave you can also use tableService.mergeEntity
        tableService.replaceEntity(tableName, item, function (error, result, response) {
            if (!error) {
                context.res.status(202).json(result);
            } else {
                context.res.status(500).json({ error: error });
            }
        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done();
    }

};