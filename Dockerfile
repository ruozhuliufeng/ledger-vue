FROM nginx

EXPOSE 80

COPY dist/ /usr/share/nginx/html/

RUN rm /etc/nginx/conf.d/default.conf

ADD ledger.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
