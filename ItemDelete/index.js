const azure = require('azure-storage');

const tableService = azure.createTableService();
const tableName = "mytable";

module.exports = function (context, req) {
    context.log('Start ItemDelete');

    const id = req.query.id;
    if (id) {
        // create a temporary object with PartitionKey & RowKey of the item which should be deleted
        var item = { PartitionKey: 'Partition', RowKey: id };
        tableService.deleteEntity(tableName, item, function (error, result, response) {
            if (!error) {
                context.res.status(204).send();
            }
            else {
                context.res.status(500).json({error : error});
            }
        });
    }
    else {
        // item to delete can't be found since no ID was passed
        context.res.status(404).send();
    }

};