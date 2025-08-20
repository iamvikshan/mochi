FROM oven/bun:1

# Install Canvas system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
CMD ["bun", "start"]
