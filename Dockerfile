# Sử dụng Node.js phiên bản mới nhất làm base image
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --only=production

# Copy toàn bộ mã nguồn vào container
COPY . .

# Biên dịch TypeScript nếu cần (nếu code NestJS có TypeScript)
RUN npm run build

# --- Chạy container ---
FROM node:18-alpine

WORKDIR /app

# Copy build từ bước trước
COPY --from=builder /app /app

# Mở port cho ứng dụng
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["node", "dist/main.js"]
