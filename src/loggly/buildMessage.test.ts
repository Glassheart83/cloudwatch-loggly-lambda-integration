import { buildMessage } from './buildMessage';
import { CloudWatchLogsDecodedData } from 'aws-lambda';

describe('BuildLogglyMessage should parse CloudWatch data and output a message to be sent to Loggly', () => {

    test('Parse logGroup and populate two events', () => {

        const example = {
            'messageType': 'DATA_MESSAGE',
            'owner': '518016877850',
            'logGroup': '/aws/lambda/cloudwatch-loggly-lambda-integration-dev-testLog',
            'logStream': '2020/01/20/[$LATEST]931e5ee2b03a40b4bba33ed73e28533c',
            'subscriptionFilters': [
                'cloudwatch-loggly-lambda-integration-dev-SubscriptionFilterTestLog-G3MEXGFFM1NB'
            ],
            'logEvents': [
                {
                    'id': '35224387935688922219730750511046540950902287180938936320',
                    'timestamp': 1579516183074,
                    'message': '2020-01-20T10:29:43.074Z\teb22a82b-31bd-45f7-847f-1ed2069ab2e8\tINFO\tTHIS IS TESTING THE LOG TRIGGER'
                },
                {
                    'id': '35224387935688922219730750511046540950902287180938936321',
                    'timestamp': 1579516183074,
                    'message': '2020-01-20T10:29:43.074Z\teb22a82b-31bd-45f7-847f-1ed2069ab2e8\tINFO\t{\n\t"test": "PIPPO"\n}'
                }
            ]
        } as CloudWatchLogsDecodedData;

        const message = buildMessage(example);

        const tags = [
            'testLog',
            'dev',
            'cloudwatch-loggly-lambda-integration'
        ];

        expect(tags).toStrictEqual(message.tagList);
        expect(2).toBe(message.events.length);

        expect(message.events[0].logContent).toHaveProperty('message');
        expect(message.events[1].logContent).toHaveProperty('test', 'PIPPO');
    });
});