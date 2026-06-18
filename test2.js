const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const category = await prisma.ebookCategory.findFirst();
  if (!category) {
    console.log("No categories found");
    return;
  }
  
  const folderId = category.id;
  
  try {
    const ebook = await prisma.ebook.create({
      data: {
        title: "Test Create Ebook",
        author: "Me",
        filePath: "/uploads/ebooks/test.pdf",
        categories: {
          create: [{
            category: {
              connect: { id: folderId }
            }
          }]
        }
      }
    });
    console.log("Success! Ebook ID:", ebook.id);
  } catch (e) {
    console.error("Prisma error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
