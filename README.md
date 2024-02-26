<img src="logo.png" height="90" />

# Alexa Flight Skill
Alexa Flight Skill for Hamburg Airport, Germany

> [!WARNING]
> Alexa Skill is offline and not developed further anymore.

## Features

* Ask for any flight +2days
* Save own flights for faster questions
* Ask for aircraft types
* Ask for any question about Hamburg Airport

## Tech-Stack

- NodeJS deployed on Amazon AWS
- Run as serverless function
  - One node for data getter
  - Second node for Alexa Skill
- Save data to DynamoDB every 10 minutes for faster answers
