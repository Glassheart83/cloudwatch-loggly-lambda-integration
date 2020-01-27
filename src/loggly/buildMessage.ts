import { LogglyMessage, CloudWatchMessage, LogglyEvent } from '@Loggly/types';
import { CloudWatchLogsDecodedData, CloudWatchLogsLogEvent } from 'aws-lambda';

const extractTagList = (s: string): string[] => {

    const splitted = s.split('-');
    const functionName = splitted.pop();
    const stage = splitted.pop();
    const service = splitted.join('-').split('/').pop();

    return [ functionName, stage, service ];
};

const cloudWatchMessage = (message: string): CloudWatchMessage => {
    
    const parse = (message: string): object => {
        try {
            return JSON.parse(message);
        } catch (e) {
            return { message };
        }
    };
    
    const tabs = message.split('\t');
    return {
        awsRequestId: tabs[1],
        level: tabs[2],
        logContent: parse(tabs.slice(3).join(''))
    };
};

export const buildMessage = (data: CloudWatchLogsDecodedData): LogglyMessage => {

    const logGroup = data.logGroup;
    const logStream = data.logStream;

    const events = data.logEvents.map((event: CloudWatchLogsLogEvent) => ({
        ...cloudWatchMessage(event.message),
        logGroup,
        logStream,
        timestamp: new Date(event.timestamp).toISOString()
    } as LogglyEvent));
    
    const tags = extractTagList(logGroup);

    return new LogglyMessage(events, tags);
};
