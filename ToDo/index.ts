import { TableClient, TableEntity, TableServiceClient } from "@azure/data-tables";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import crud from "../crudWrapper";
import { ToDo } from "./todo.model";
import { v4 as uuidv4 } from 'uuid';

const getFunc: AzureFunction = async function (context: Context, req: HttpRequest, tableClient: TableClient): Promise<void> {
    const id = context.bindingData.id;
    if (id) {
        const entity = await tableClient.getEntity("todo", id);
        context.res = {
            body: entity
        };
    }
    else {
        const todos: ToDo[] = [];
        const query = tableClient.listEntities<TableEntity<ToDo>>();
        for await (const entity of query) {
            todos.push(entity);
        }
        context.res = {
            body: todos
        };
    }
};

const postFunc: AzureFunction = async function (context: Context, req: HttpRequest, tableClient: TableClient): Promise<void> {

    const entity: TableEntity<ToDo> = {
        partitionKey: "todo",
        rowKey: uuidv4(),
        ...req.body
    };
    await tableClient.createEntity(entity);

    context.res = {
        status: 201,
        body: entity,
        location: `api/todo/${entity.rowKey}`
    };
}

const putFunc: AzureFunction = async function (context: Context, req: HttpRequest, tableClient: TableClient): Promise<void> {
    const id = context.bindingData.id;
    const entity: TableEntity<ToDo> = {
        ...req.body,
        partitionKey: "todo",
        rowKey: id,
    };
    await tableClient.updateEntity(entity);

    context.res = {
        body: entity
    };
}

const deleteFunc: AzureFunction = async function (context: Context, req: HttpRequest, tableClient: TableClient): Promise<void> {
    const id = context.bindingData.id;
    await tableClient.deleteEntity("todo", id);

    context.res = {
        status: 204
    };
}

export default crud(getFunc, postFunc, putFunc, deleteFunc, "todo");