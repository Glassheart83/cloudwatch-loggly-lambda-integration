import { Context, CloudWatchLogsEvent, CloudWatchLogsDecodedData } from 'aws-lambda';
import { gunzip } from 'zlib';
import { request, IncomingMessage } from 'http';
import { buildMessage } from '@Loggly/buildMessage';

export const lambda = (event: CloudWatchLogsEvent, context: Context) => {

    const buffer = Buffer.from(event.awslogs.data, 'base64');

    gunzip(buffer, (error: Error, result: Buffer) => {

        if (error) {
            context.fail(error);
        }

        const data = JSON.parse(result.toString('ascii')) as CloudWatchLogsDecodedData;

        console.log('DECODED DATA');
        console.log(JSON.stringify(data));

        const logglyMessage = buildMessage(data);

        const options = logglyMessage.requestOptions();

        const req = request(options, (response: IncomingMessage) => {

            response.on('data', chunk => {
                const result = JSON.parse(chunk.toString());
                if (result.response === 'ok') {
                    context.succeed('All events has been sent to Loggly.');
                }
            });

            response.on('end', () => {
                context.done();
            });
        });

        req.on('error', (error: Error) => {
            context.fail(error);
        });

        req.write(logglyMessage.toString());
        req.end();
    });
};
