import type { Prisma } from "../../database/prisma/generate/prisma/client.js";

export const MachineryService = {
  create: async (machine: Prisma.MachineryCreateInput) => {
    const result = await prisma?.machinery.create({
      data: machine,
    });
    return result;
  },

  //   update
  update: async (id: string, machine: Prisma.MachineryUpdateInput) => {
    const query = await prisma?.machinery.update({
      data: machine,
      where: { id },
    });
    return;
  },

  delete: async (id: string) => {
    await prisma?.machinery.delete({ where: { id } });
    return;
  },

  getAll: async () => {
    const machines = prisma?.machinery.findMany();
    return machines;
  },

  getOne: async (id: string) => {
    const machines = prisma?.machinery.findFirst({
      where: { id },
    });
    return machines;
  },
};
