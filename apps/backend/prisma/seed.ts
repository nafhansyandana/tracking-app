import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'superuser@local.dev';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log('Superuser already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.create({
    data: {
      nik: '0000000000',
      name: 'Superuser',
      email,
      passwordHash,
      role: Role.SUPERUSER,
    },
  });

  console.log('Seeded superuser:', email, 'password: Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
