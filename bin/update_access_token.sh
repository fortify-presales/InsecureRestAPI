#!/bin/bash

while [[ "$#" -gt 0 ]]; do
	case $1 in
		--fcli) FCLI="$2"; shift; shift ;;
		--ssc-url) SSC_URL="$2"; shift; shift ;;
		--ssc-token) SSC_TOKEN="$2"; shift; shift ;;
		--sc-sast-token) SC_SAST_TOKEN="$2"; shift; shift;;
		-u|--site-url) SiteUrl="$2"; shift; shift ;;
		-e|--site-email) SiteEmail="$2"; shift; shift ;;
		-p|--site-password) SitePassword="$2"; shift; shift ;;
		-k|--key-store-entry) KeyStoreEntry="$2"; shift; shift ;;
		-*|--*) echo "Unknown parameter passed: $1"; exit 1 ;;
		*) POSITIONAL_ARGS+=("$1"); shift ;;
	esac
done
if [ -z "$FCLI" ]; then
	echo "--fcli parameter is required"
	exit 1
fi
if [ -z "$SSC_URL" ]; then
	echo "--ssc-url parameter is required"
	exit 1
fi
if [ -z "$SSC_TOKEN" ]; then
	echo "--ssc-token parameter is required"
	exit 1
fi
if [ -z "$SC_SAST_TOKEN" ]; then
	echo "--sc-sast-token parameter is required"
	exit 1
fi
if [ -z "$SiteUrl" ]; then
	SiteUrl="https://insecureapi.azurewebsites.net"
fi
echo "Using SiteUrl: ${SiteUrl}"
if [ -z "$SiteEmail" ]; then
	SiteEmail="admin@localhost.com"
fi
echo "Using SiteEmail: ${SiteEmail}"
if [ -z "$SitePassword" ]; then
	SitePassword="password"
fi
echo "Using SitePassword: ${SitePassword}"
echo $KeyStoreEntry
if [ -z "$KeyStoreEntry" ]; then
	echo "--key-store-entry parameter is required"
	exit 1
fi
echo "Using KeyStoreEntry: ${KeyStoreEntry}"
echo "---"


echo "Waiting until site is available ..."
until curl --head --silent --fail ${SiteUrl}/docs/openapi.json 1> /dev/null 2>&1; do
    sleep 1
done

echo "Installing jq ..."
curl --silent -L https://github.com/jqlang/jq/releases/download/jq-1.8.1/jq-linux-amd64 --output jq
chmod a+x ./jq

echo "Retrieving access token ..."
JwtAccessToken=$(curl --silent -H 'Content-Type: application/json' \
	-d '{ "email":"'${SiteEmail}'","password":"'${SitePassword}'"}' \
	-X POST \
	${SiteUrl}/api/v1/site/sign-in | ./jq -r '.data.accessToken')
echo $JwtAccessToken       

echo "Updating ScanCentral DAST Key Store ..."
EncodedKeyStoreEntry=$(printf %s $KeyStoreEntry | ./jq -sRr @uri)
#echo $EncodedKeyStoreEntry

${FCLI} ssc session login --url ${SSC_URL} -t ${SSC_TOKEN} -c ${SC_SAST_TOKEN} --ssc-session update-access-token > /dev/null
${FCLI} sc-dast rest call /api/v2/key-stores/key-store-entries/$EncodedKeyStoreEntry --store myKeyStore --ssc-session update-access-token

KeyStoreEntryId=$(${FCLI} util var contents myKeyStore -o json | ./jq -r '.[0].id')
KeyStoreId=$(${FCLI} util var contents myKeyStore -o json | ./jq -r '.[0].keyStoreId')

cat >update.json <<EOL
{
  "keyStoreEntriesToUpdate": [
    {
      "id": ${KeyStoreEntryId},
      "keyStoreEntryValue": "${JwtAccessToken}"
    }
  ]
}
EOL
${FCLI} sc-dast rest call /api/v2/key-stores/${KeyStoreId}/save-key-store-entries -X POST -d "@@update.json" --ssc-session update-access-token
${FCLI} ssc session logout --ssc-session update-access-token > /dev/null

echo "Done."
