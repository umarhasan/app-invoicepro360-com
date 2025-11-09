FROM public.ecr.aws/docker/library/node:18.20.5 as build-stage

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM public.ecr.aws/nginx/nginx:1.27
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
