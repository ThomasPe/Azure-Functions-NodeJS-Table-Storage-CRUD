const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService();
const tableName = "mytable";

module.exports = function (context, req) {
    context.log('Start ItemCreate');

    if (req.body) {

        // TODO: Add some object validation logic & 
        //       make sure the object is flat

        const item = req.body;
        item["PartitionKey"] = "Partition";
        item["RowKey"] = uuid();

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity(tableName, item, { echoContent: true }, function (error, result, response) {
            if (!error) {
                context.res.status(201).json(response);
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