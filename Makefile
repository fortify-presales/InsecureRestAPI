-include .env

ROOT_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/..)
ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
PROJECT := InsecureRestAPI
PROJECT_LOWER := $(shell echo $(PROJECT) | tr '[:upper:]' '[:lower:]')
PROJECTS := $(shell ls . | grep project)
VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2> /dev/null || echo "1.0.0")
COMMIT := $(shell git log -1 --pretty=format:"%H")
UNAME := $(shell uname)

FLASK_APP := iwa

SAST_DEFAULT_OPTS := -Dcom.fortify.sca.ProjectRoot=.fortify -b "$(PROJECT)"
SAST_SCAN_OPTS := $(SAST_DEFAULT_OPTS)
ifeq ($(OS),Windows_NT)
	SAST_TRANSLATE_OPTS := $(SAST_DEFAULT_OPTS) iwa
	SAST_CUSTOM_RULES := etc\\sast-custom-rules\\example-custom-rules.xml
	SAST_FILTER := etc\\sast-filters\\example-filter.txt
else
	SAST_TRANSLATE_OPTS := $(SAST_DEFAULT_OPTS) iwa
	SAST_CUSTOM_RULES := $(ROOT_DIR)/etc/sast-custom-rules/example-custom-rules.xml
	SAST_FILTER := $(ROOT_DIR)/etc/sast-filters/example-filter.txt 
endif

.PHONY: default
default: help

# generate help info from comments
.PHONY: help
help: ## help information about make commands
	@grep -h -P '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
ifeq ($(OS),Windows_NT)
	@echo Running on Windows: $(OS)
else
	@echo Running on Linux/UNIX: $(UNAME)
endif

.PHONY: version
version: ## display the version of the service
	@echo $(VERSION)

.PHONY: build
build:  ## build the project
	@echo "Building $(PROJECT)..."
	npm install
	npm run swagger
	npm run build

.PHONY: build-docker
build-docker: ## build the project as a docker image
	docker build -f Dockerfile -t $(PROJECT):$(VERSION) .

.PHONY: run
run: ## run the project
	@echo "Running $(PROJECT)..."
	npm run swagger
	npm run dev

.PHONY: run-production
run-production: ## run the project in production mode
	@echo "Running $(PROJECT) in production mode..."
	npm run start

.PHONY: test
test: ## run unit tests for the project
	@echo "Testing $(PROJECT)..."
	npm run test

.PHONY: clean
clean: ## remove temporary files
ifeq ($(OS),Windows_NT)
	cmd /c "rmdir /s /q instance node-modules .fortify"
else
	rm -rf instance node-modules .fortify *.lock *.fpr
endif

.PHONY: sast-scan
sast-scan: ## run OpenText static application security testing
	@echo "Running OpenText static application security testing..."
	sourceanalyzer $(SAST_DEFAULT_OPTS) -clean
	sourceanalyzer $(SAST_TRANSLATE_OPTS)
	sourceanalyzer $(SAST_SCAN_OPTS) -scan \
		-rules $(SAST_CUSTOM_RULES) \
		-filter $(SAST_FILTER) \
		-build-project "$(PROJECT)" -build-version "$(VERSION)" -build-label "SNAPSHOT" \
		-f "$(PROJECT).fpr"
ifeq ($(OS),Windows_NT)
	cmd /c "FPRUtility -information -analyzerIssueCounts -project $(PROJECT).fpr"
else
	FPRUtility -information -analyzerIssueCounts -project "$(PROJECT).fpr"
endif

.PHONY: sca-scan
sca-scan: ## run OpenText software composition analysis
	@echo "Running OpenText software composition analysis..."
	debricked scan . -r $(PROJECT) -c $(COMMIT) -t $(DEBRICKED_TOKEN)

.PHONY: nexus-iq-scan
nexus-iq-scan: ## run Sonatype Nexus IQ software composition analysis
	@echo "Running Sonatype Nexusi IQ software composition analysis..."
	nexus-iq-cli -i $(PROJECT_LOWER) -s $(NEXUS_IQ_URL) -a "$(NEXUS_IQ_USERNAME):$(NEXUS_IQ_PASSWORD)" package-lock.json