# 1) Builder 단계: 의존 설치 + 빌드
FROM node:18-alpine AS builder
WORKDIR /app

# package-lock.json까지 복사해서 정확히 설치
COPY package.json package-lock.json ./
RUN npm ci

# 소스 전체 복사
COPY . .

# Next.js 빌드 (App Router 기준으로 .next + static 페이지 생성)
RUN npm run build

# 2) Production 단계: 런타임용으로 경량화
FROM node:18-alpine
WORKDIR /app

# production 환경 변수
ENV NODE_ENV=production

# 빌드 결과물만 복사
COPY --from=builder /app/package.json      ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.next             ./.next
COPY --from=builder /app/node_modules      ./node_modules
COPY --from=builder /app/public            ./public

# 컨테이너가 열 포트
EXPOSE 3000

# next start 로 서버 구동
CMD ["npm", "start"]
