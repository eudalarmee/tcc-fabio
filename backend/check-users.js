import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('\n📋 Usuários no banco de dados:\n');
    console.log('='.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Criado em: ${user.createdAt.toLocaleString('pt-BR')}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Total de usuários: ${users.length}\n`);

  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
