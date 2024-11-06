[![Fortify Security Scan](https://github.com/fortify-presales/IWA-API-Node/actions/workflows/fod.yml/badge.svg)](https://github.com/fortify-presales/IWA-API-Node/actions/workflows/fod.yml)

# IWA-API-Node

#### Table of Contents

* [Overview](#overview)
* [Forking the Repository](#forking-the-repository)
* [Setting up the Development Environment](#setting-up-the-development-environment)
* [Running the Application](#running-the-application)

## Overview

_IWA-API-Node_ is an insecure [NodeJS](https://nodejs.org/)/[ExpressJS](https://expressjs.com/) REST API for use in Fortify demonstrations.
It includes some examples of bad  and insecure code - which can be found using static and dynamic application security testing tools such
as those provided by [Fortify by OpenText](https://www.microfocus.com/en-us/cyberres/application-security).

The application is intended to provide the backend functionality of a typical "online pharmacy", including purchasing Products (medication)
and requesting Services (prescriptions, health checks etc).

*Please note: the application should not be used in a production environment!*

## Forking the Repository

In order to execute example scenarios for yourself, it is recommended that you "fork" a copy of this repository into
your own GitHub account. The process of "forking" is described in detail in the [GitHub documentation](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)
- you can start the process by clicking on the "Fork" button at the top right.


## Setting up the Development Environment

For this application to run you will require the following to be installed:

- [MongoDB](https://www.mongodb.com/) Community Edition
- [NodeJS](https://nodejs.org/) LTS version

Clone the repository (preferably your fork from above) and then install all the required third-party packages using:

Running the Application
-----------------------

***Install npm packages***

```agsl
npm i
npm i -g ts-node-dev
```
**Populate MongoDB**

```aidl
node mongodb/populateDb.js all
```

**Start Express API**

```aidl
npm run dev
```

The API should then be accessible at [http://localhost:3000](http://localhost:3000)
