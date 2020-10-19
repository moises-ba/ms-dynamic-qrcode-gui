### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/ms-dynamic-qrcode-gui /usr/share/nginx/html




#FROM node:12.2.0


#WORKDIR /app

#COPY package.json package-lock.json ./

#COPY package.json package-lock.json /app/

#RUN npm install
#RUN npm install -g @angular/cli

# add app
#COPY . /app

# start app
#CMD ng serve --host 0.0.0.0