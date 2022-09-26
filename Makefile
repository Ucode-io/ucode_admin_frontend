CURRENT_DIR=$(shell pwd)

APP=$(shell basename ${CURRENT_DIR})

APP_CMD_DIR=${CURRENT_DIR}/cmd

REGISTRY=gitlab.udevs.io:5050
TAG=latest
ENV_TAG=latest
PROJECT_NAME=gg


clear:
	rm -rf ${CURRENT_DIR}/bin/*

network:
	docker network create --driver=bridge ${NETWORK_NAME}

mark-as-production-image:
	docker tag ${REGISTRY}/${APP}:${TAG} ${REGISTRY}/${APP}:production
	docker push ${REGISTRY}/${APP}:production

build-image-staging:
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:albatta-${TAG} . -f Dockerfile-albatta-test
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:albatta-${ENV_TAG}
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:editory-${TAG} . -f Dockerfile-editory-test
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:editory-${ENV_TAG}
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:parfume-${TAG} . -f Dockerfile-parfume-test
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:parfume-${ENV_TAG}
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${TAG} . -f Dockerfile-medion-test
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${ENV_TAG}

build-image-prod:
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${TAG} . -f Dockerfile-medion-prod
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${ENV_TAG}

build-image:
	docker build --rm -t ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} .
	docker tag ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG} ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

push-image-staging:
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:albatta-${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:albatta-${ENV_TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:editory-${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:editory-${ENV_TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:parfume-${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:parfume-${ENV_TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${ENV_TAG}

push-image-prod:
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:medion-${ENV_TAG}

push-image:
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:${TAG}
	docker push ${REGISTRY}/${PROJECT_NAME}/${APP}:${ENV_TAG}

.PHONY: proto
