<img src="logo.png" height="90" />

# Alexa Flight Skill
Inofficial Alexa Flight Skill for Hamburg Airport in Germany.

> [!WARNING]
> Alexa Skill is offline and not developed further anymore.

## Features

* Ask for any flight +2 days
* Mark specific flights for faster questions
* Ask for aircraft types
* Ask for questions about Hamburg Airport

## Tech-Stack

- Language: NodeJS
- Deployed on Amazon AWS as serverless function:
  - One node for data getter
  - Second node for Alexa Skill
- Puffer data in AWS DynamoDB every 10 minutes
