import { RequestOptions } from 'http';

export type CloudWatchMessage = {
    awsRequestId: string;
    level: string;
    logContent: object;
};

export type CloudWatchMetadata = {
    logGroup: string;
    logStream: string;
    timestamp: string;
};

export type LogglyEvent = CloudWatchMessage & CloudWatchMetadata;

export class LogglyMessage {
    
    events: LogglyEvent[];
    tagList: string[];
    bodyString: string;
    
    constructor(events: LogglyEvent[], tagList: string[]) {
        this.events = events;
        this.tagList = tagList;
    }
    
    tags() {
        return this.tagList.join(',');
    }

    toString() {
        if (!this.bodyString) {
            this.bodyString = this.events
                .map((event: LogglyEvent) => JSON.stringify(event))
                .join('\n');
        }
        return this.bodyString;
    }

    requestOptions(): RequestOptions {

        const customerToken = process.env.LOGGLY_CUSTOMER_KEY;
        return {
            hostname: process.env.LOGGLY_HOSTNAME,
            path: `/bulk/${customerToken}/tag/${encodeURIComponent(this.tags())}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': this.toString().length
            }
        };
    }
}