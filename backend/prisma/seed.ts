import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const exercises = [
  // COSTAS
  { name: 'Puxada na barra-fixa', muscleGroup: 'Costas', equipment: 'Peso corporal', difficulty: 'Intermediário' },
  { name: 'Puxada na frente (pulldown)', muscleGroup: 'Costas', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Remada curvada', muscleGroup: 'Costas', equipment: 'Barra', difficulty: 'Intermediário' },
  { name: 'Remada cavalinho', muscleGroup: 'Costas', equipment: 'Máquina', difficulty: 'Intermediário' },
  { name: 'Levantamento terra', muscleGroup: 'Costas', equipment: 'Barra', difficulty: 'Avançado' },

  // PERNAS
  { name: 'Agachamento livre', muscleGroup: 'Pernas', equipment: 'Barra', difficulty: 'Intermediário' },
  { name: 'Agachamento hack', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'Intermediário' },
  { name: 'Leg press', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'Intermediário' },
  { name: 'Cadeira extensora', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Mesa flexora', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Stiff', muscleGroup: 'Pernas', equipment: 'Barra', difficulty: 'Intermediário' },
  { name: 'Avanço (passada) com halteres', muscleGroup: 'Pernas', equipment: 'Halteres', difficulty: 'Intermediário' },
  { name: 'Panturrilha em pé', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Panturrilha sentado', muscleGroup: 'Pernas', equipment: 'Máquina', difficulty: 'Iniciante' },

  // PEITO
  { name: 'Supino reto', muscleGroup: 'Peito', equipment: 'Barra', difficulty: 'Intermediário' },
  { name: 'Supino inclinado com halteres', muscleGroup: 'Peito', equipment: 'Halteres', difficulty: 'Intermediário' },
  { name: 'Crucifixo inclinado', muscleGroup: 'Peito', equipment: 'Halteres', difficulty: 'Intermediário' },
  { name: 'Cross-over', muscleGroup: 'Peito', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Peck deck', muscleGroup: 'Peito', equipment: 'Máquina', difficulty: 'Iniciante' },

  // OMBROS
  { name: 'Desenvolvimento militar', muscleGroup: 'Ombros', equipment: 'Barra', difficulty: 'Intermediário' },
  { name: 'Desenvolvimento com halteres', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'Intermediário' },
  { name: 'Elevação lateral', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'Iniciante' },
  { name: 'Elevação frontal', muscleGroup: 'Ombros', equipment: 'Halteres', difficulty: 'Iniciante' },
  { name: 'Remada alta', muscleGroup: 'Ombros', equipment: 'Barra', difficulty: 'Intermediário' },

  // BÍCEPS
  { name: 'Rosca direta', muscleGroup: 'Bíceps', equipment: 'Barra', difficulty: 'Iniciante' },
  { name: 'Rosca alternada', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 'Iniciante' },
  { name: 'Rosca martelo', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 'Iniciante' },
  { name: 'Rosca Scott', muscleGroup: 'Bíceps', equipment: 'Máquina', difficulty: 'Intermediário' },

  // TRÍCEPS
  { name: 'Tríceps testa', muscleGroup: 'Tríceps', equipment: 'Barra', difficulty: 'Intermediário' },
  { name: 'Tríceps corda (polia)', muscleGroup: 'Tríceps', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Mergulho em paralelas', muscleGroup: 'Tríceps', equipment: 'Peso corporal', difficulty: 'Intermediário' },
  { name: 'Tríceps francês', muscleGroup: 'Tríceps', equipment: 'Halteres', difficulty: 'Intermediário' },

  // CORE
  { name: 'Prancha', muscleGroup: 'Core', equipment: 'Peso corporal', difficulty: 'Iniciante' },
  { name: 'Abdominal infra (banco)', muscleGroup: 'Core', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Abdominal crunch', muscleGroup: 'Core', equipment: 'Máquina', difficulty: 'Iniciante' },
  { name: 'Elevação de pernas na barra', muscleGroup: 'Core', equipment: 'Peso corporal', difficulty: 'Intermediário' },

  // EXTRAS (complete a lista para chegar em 50+)
  { name: 'Pull-over com halter', muscleGroup: 'Costas', equipment: 'Halteres', difficulty: 'Intermediário' },
  { name: 'Remada baixa (cabo)', muscleGroup: 'Costas', equipment: 'Máquina', difficulty: 'Intermediário' },
  { name: 'Good morning', muscleGroup: 'Pernas', equipment: 'Barra', difficulty: 'Avançado' },
  { name: 'Crossover alto-baixo', muscleGroup: 'Peito', equipment: 'Máquina', difficulty: 'Intermediário' },
  { name: 'Face pull', muscleGroup: 'Ombros', equipment: 'Máquina', difficulty: 'Intermediário' },
  { name: 'Rosca concentrada', muscleGroup: 'Bíceps', equipment: 'Halteres', difficulty: 'Intermediário' },
  { name: 'Kickback', muscleGroup: 'Tríceps', equipment: 'Halteres', difficulty: 'Iniciante' },
];

async function main() {
  await prisma.exercise.createMany({ data: exercises, skipDuplicates: true });
  console.log(`Seed OK: ${exercises.length} exercícios inseridos/atualizados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
