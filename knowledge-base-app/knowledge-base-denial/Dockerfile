FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY knowledge-base-denial.html /usr/share/nginx/html/index.html

COPY ../data/ /usr/share/nginx/html/data/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
