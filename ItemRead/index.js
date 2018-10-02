const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = "mytable";

module.exports = function (context, req) {
    context.log('Start ItemRead');

    const id = req.query.id;
    if (id) {
        // return item with RowKey 'id'
        tableService.retrieveEntity(tableName, 'Partition', id, function (error, result, response) {
            if (!error) {
                context.res.status(200).json(response.body);
            }
            else {
                context.res.status(500).json({error : error});
            }
        });
    }
    else {
        // return the top x items
        var query = new azure.TableQuery().top(100);
        tableService.queryEntities(tableName, query, null, function (error, result, response) {
            if(!error){
                context.res.status(200).json(response.body.value);
            } else {
                context.res.status(500).json({error : error});
            }
        });
    }
};