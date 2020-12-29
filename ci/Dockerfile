FROM dockerhub.kube.vimpelcom.ru/nginx:1.15.1-alpine

LABEL maintainer="SergT <sentyurin@beeline.ru>, PKlyuev <pklyuev@beeline.ru>"

#COPY ci/nginx.conf /etc/nginx
COPY build /static

WORKDIR /static

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
