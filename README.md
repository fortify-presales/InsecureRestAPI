[![Fortify Security Scan](https://github.com/fortify-presales/InsecureRestAPI/actions/workflows/fod.yml/badge.svg)](https://github.com/fortify-presales/InsecureRestAPI/actions/workflows/fod.yml) [![Debricked](https://github.com/kadraman/InsecureRestAPI/actions/workflows/debricked.yml/badge.svg)](https://github.com/kadraman/InsecureRestAPI/actions/workflows/debricked.yml)

# InsecureRestAPI

_InsecureRestAPI_ is a simple NodeJS/Express/MongoFB REST API fthat can be used for the demonstration of Application Security testing tools - such as [OpenText Application Security](https://www.opentext.com/products/application-security).

Pre-requisities
---------------

 - Windows or Linux machine with Node 20 or later
 - [node package manager](https://docs.npmjs.com/about-npm)
 - [GNU Make](https://www.gnu.org/software/make/)
 - [MongoDB](https://www.mongodb.com/) Community Edition (optional)
 - Docker installation (optional)

Run Application (locally)
-------------------------

You can the run the application locally using the following:


```
npm i
npm i -g ts-node-dev
npm run dev
```

The API should then be available at the URL `http://localhost:5000`. If it fails to start,
make sure you have no other applications running on port 5000. 

Run Application (as Docker container)
-------------------------------------

You also can build a Docker image for the application using the following:

```
npm run build
docker build -t demoapi:latest .
```

Then run the container using a command similar to the following:

```
docker run -dp 8080:5000 demoapi:latest
```

The API should then be available at the URL `http://localhost:8080`. If it fails to start,
make sure you have no other applications running on port 8080.

Using the API
-------------

Most of the API operations do not require authentication.

Scan Application (with OpenText Application Security)
-----------------------------------------------------

To carry out a Fortify Static Code Analyzer local scan, run the following:

```
make sast-scan
```

To carry out a Fortify ScanCentral SAST scan, run the following:

```
fcli ssc session login
scancentral package -o package.zip -bt none
fcli sast-scan start --release "_YOURAPP_:_YOURREL_" -f package.zip --store curScan
fcli sast-scan wait-for ::curScan::
fcli ssc action run appversion-summary --av "_YOURAPP_:_YOURREL_" -fs "Security Auditor View" -f summary.md
```

To carry out a Fortify on Demand scan, run the following:

```
fcli fod session login
scancentral package -o package.zip -bt none -oss
fcli fod sast-scan start --release "_YOURAPP_:_YOURREL_" -f package.zip --store curScan
fcli fod sast-scan wait-for ::curScan::
fcli fod action run release-summary --rel "_YOURAPP_:_YOURREL_" -f summary.md
```

---

Kevin A. Lee (kadraman) - klee2@opentext.com
