import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Já existe um usuário admin:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Nome:', existingAdmin.name);
      return;
    }

    // Criar senha hash
    const password = 'admin123'; // Senha padrão
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@musclemax.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('\n🎉 Usuário Admin criado com sucesso!\n');
    console.log('📧 Email: admin@musclemax.com');
    console.log('🔑 Senha: admin123');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
