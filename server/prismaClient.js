// db 스키마 변경되거나 schema.prisma 수정하면 실행
// npx prisma db pull
// npx prisma generate
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
