import { TableClient } from '@azure/data-tables';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

export default function crud(get: AzureFunction, post: AzureFunction, put: AzureFunction, del: AzureFunction, domain: string) {
    return async function (context: Context, req: HttpRequest, ...args: any[]): Promise<void> {

        const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, domain);
        await tableClient.createTable();
        
        args.push(tableClient);

        switch (req.method) {
            case "GET":
                await get(context, req, ...args);
                break;
            case "POST":
                await post(context, req, ...args);
                break;
            case "PUT":
                await put(context, req, ...args);
                break;
            case "DELETE":
                await del(context, req, ...args);
                break;
            default:
                context.res = {
                    status: 405,
                    body: "Method not allowed"
                };
        }
    };
}