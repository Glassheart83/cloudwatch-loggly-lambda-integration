# cloudwatch-loggly-lambda-integration
## Introduction
*cloudwatch-loggly-lambda-integration* is a lambda that allow to asynchronously take logs from CloudWatch and push them to Loggly.
## Usage
Various verbs are available through `yarn`.
- `yarn` or `yarn install` install the dependencies.
- `yarn lint` runs the linter and code formatting.
- `yarn build` runs a clean, the linter and build the code. Built code is stored in `dist/` directory.
- `yarn test` runs Jest suite, running all tests under `__tests__` folders in `src/`.
## Forward Logs
In order to use *cloudwatch-loggly-lambda-integration* to forward log to Loggly the source project needs to be configured by adding to `serverless.yml` the plugin [serverless-log-forwarding](https://github.com/amplify-education/serverless-log-forwarding) and by configuring it as explained in the plugin page.
It's sufficient to use the lambda ARN or to use a CloudFormation variable reference like `${cf:cloudwatch-loggly-lambda-integration-dev.SendToLogglyArn}`
## Log Format
*cloudwatch-loggly-lambda-integration* forwards logs in this format:
```json
{
    "awsRequestId": "d8a56699-e569-41ab-80d1-e4dc205fb682",
    "level": "INFO",
    "logContent": {
        "message":"This is the testing message to see how it will result on CloudWatch"
    },
    "logGroup": "/aws/lambda/cloudwatch-loggly-lambda-integration-dev-testLog",
    "logStream": "2020/01/21/[$LATEST]5d8da23e18ae483e8832549aedb79f7a",
    "timestamp": "2020-01-21T13:15:04.718Z"
}
```
All fields are extracted from CloudWatch, while `logContent` is a parsed JSON of the CloudWatch log message body. If a valid JSON is passed to CloudWatch it will be parsed accordingly, if a string or other kind of unparseable content is passed a single string under `message` will results.
## Environment Variables
*cloudwatch-loggly-lambda-integration* uses [serverless-dotenv-plugin](https://github.com/colynb/serverless-dotenv-plugin) to ensure environment variables are loaded into the stack.
Create a `.env` file in your project root and add the following variables:
```
LOGGLY_CUSTOMER_KEY=<Your Loggly customer token>
LOGGLY_HOSTNAME=logs-01.loggly.com
```
[Here](https://www.loggly.com/docs/customer-token-authentication-token/) more details on how to get the customer token for your Loggly instance