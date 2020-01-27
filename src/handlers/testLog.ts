import { Context } from 'aws-lambda';

class LogMessage {

    constructor(fields: Partial<LogMessage>) {
        Object.assign(this, fields);
    }
}

export const lambda = (event: any = {}, context: Context) => {

    const json = JSON.parse(event.body);

    const logMessage = new LogMessage({
        message: 'This is the testing message to see how it will result on CloudWatch',
        checkoutId: 123456789,
        ...json
    });

    console.log(JSON.stringify(logMessage));

    return {
        statusCode: 200,
        body: JSON.stringify({
            log: logMessage,
            context: context
        })
    };
};
