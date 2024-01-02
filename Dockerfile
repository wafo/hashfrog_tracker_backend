# ==============================================================
# Node image as base
# ==============================================================
# The flag below is needed when building on ARM like Mac/Macbook M1/M2 and it doens't hurt to leave it there.
FROM --platform=linux/amd64 node:20.10-alpine3.18 as base
# FROM node:16.19.0-alpine3.16 as base

# ==============================================================
# Seting all env 
# ==============================================================
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 3000
ENV REDIS_HOST redis
ENV REDIS_PORT 6379
ENV OOTR_URL https://ootrandomizer.com
# Once the image is built, you can launch containers and provide values for ENV variables from the CLI or a YML file.
# All of those will override the default values.
# You can pass ANY variable, even those not explicitly defined in the Dockerfile.
# So... check the .env for the variables the container will need :)

# ==============================================================
# Install openssl for Prisma
# ==============================================================
RUN apk update && apk add openssl

# ==============================================================
# Install all node_modules, including dev dependencies
# ==============================================================
FROM base as deps

WORKDIR /hashfrog
ADD package.json ./

RUN npm install --production=false

# ==============================================================
# Set production node_modules
# ==============================================================
FROM base as production-deps

WORKDIR /hashfrog
COPY --from=deps /hashfrog/node_modules /hashfrog/node_modules
ADD package.json ./

# Removes all dev dependencies
RUN npm prune --production

# ==============================================================
# Building the app
# ==============================================================

# No need in this case...

# ==============================================================
# Finally, build the production image with minimal footprint
# ==============================================================
# This last FROM is the final base image.
FROM base 

WORKDIR /hashfrog
COPY --from=production-deps /hashfrog/node_modules /hashfrog/node_modules

ADD index.js ./
ADD app.js ./
ADD package.json ./
ADD src ./src

CMD ["node", "index.js"]