FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV SUPABASE_DB_URL=postgresql://postgres:bohzis-copxe2-Pyftew@db.tkdpwugdbznkqflrrgxn.supabase.co:5432/postgres
ENV SUPABASE_DB_SSL=true
ENV JWT_SECRET=ae6e57029e6690b9e43718b3d52cce69a3af3cd856871536e11836eb430129ab
ENV JWT_EXPIRES_IN=7d
ENV CLIENT_URLS=*

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./

EXPOSE 5000

CMD ["npm", "start"]
