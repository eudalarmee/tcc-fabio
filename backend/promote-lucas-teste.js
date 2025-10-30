import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin() {
  try {
    const email = 'lucas.teste@gmail.com';
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return;
    }

    console.log('\n📋 Usuário atual:');
    console.log('   Nome:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role atual:', user.role);

    if (user.role === 'ADMIN') {
      console.log('\n✅ Este usuário já é ADMIN!');
      return;
    }

    // Promover para ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });

    console.log('\n🎉 Usuário promovido para ADMIN com sucesso!');
    console.log('   Role nova:', updatedUser.role);
    console.log('\n📌 IMPORTANTE: Faça logout e login novamente no site para as mudanças terem efeito.\n');
    console.log('⚠️  O token JWT antigo ainda tem a role USER, você precisa gerar um novo token fazendo login novamente.\n');

  } catch (error) {
    console.error('❌ Erro ao promover usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

promoteToAdmin();
