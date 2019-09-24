# loggy

A tiny microservice for aggregating Gelf logs and posting them into a Slack channel.

NOTE: I'm currently working on the book Bootstrapping Microservices with Docker, Kubernetes and Terraform. 

[Follow on Twitter (@ashleydavis75)](https://twitter.com/ashleydavis75) to be updated on progress!

## To use

Create a Docker image from this repo. 

Supply the following environment variables:

- SLACK_WEB_HOOK: Set this to the web hook for posting to your designated Slack workspace.
- SLACK_CHANNEL_NAME: This is the channel that messages should be posted to.

## Docker-Compose example:

You can add loggy to your Docker-Compose files as follows (assuming myservice is a microservice you have added):

    version: '3'
    services:
        
    loggy:
        image: loggy
        build: 
        context: ./loggy
        dockerfile: Dockerfile-dev
        container_name: loggy
        network_mode: host 
        volumes:
        - /tmp/loggy/npm-cache:/root/.npm:z
        - ./loggy/src:/usr/src/app/src:z
        ports:
        - "12201:12201/udp"
        environment:
        - SLACK_WEB_HOOK=<your-Slack-web-hook-here>
        - SLACK_CHANNEL_NAME=<name-of-your-Slack-channel-here>
        restart: always

    myservice:
        image: myservice
        build: 
        context: ./myservice
        dockerfile: Dockerfile-dev
        container_name: myservice
        volumes:
        - /tmp/myservice/npm-cache:/root/.npm:z
        - ./myservice/src:/usr/src/app/src:z
        ports:
        - "80:80"
        restart: always
        logging:
        driver: gelf
        options:
            gelf-address: "udp://localhost:12201"
        depends_on:
        - loggy
        links:
        - loggy