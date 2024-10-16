FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY index.html /usr/share/nginx/html/index.html

COPY styles.css /usr/share/nginx/html/styles.css

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
