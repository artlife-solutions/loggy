if (!process.env.SLACK_WEB_HOOK) {
    throw new Error("Please set env var SLACK_WEB_HOOK.");
}

const SLACK_WEB_HOOK = process.env.SLACK_WEB_HOOK as string;

if (!process.env.SLACK_CHANNEL_NAME) {
    throw new Error("Please set env var SLACK_CHANNEL_NAME.");
}

const SLACK_CHANNEL_NAME = process.env.SLACK_CHANNEL_NAME as string;

const Bottleneck = require("bottleneck")
import axios from "axios";

const server = require('graygelf/server')();

const limiter = new Bottleneck(0, 400); // 400 ms default

//
// Forward the message to Slack.
//
function forwardLog(text: string): Promise<any> {
    return axios.post(
        SLACK_WEB_HOOK,
        {
            channel: "#" + SLACK_CHANNEL_NAME,
            text,
        },
        {
            headers: {
                "Content-type": "application/json",
            },
        }
    );
}

server.on('message', (message: any) => {
    const text = message.host + "/" + message._container_name + ": " + message.short_message;
    console.log(text);
    limiter.schedule(forwardLog, text);
});

server.listen(12201);