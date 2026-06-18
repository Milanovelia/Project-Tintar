const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find a category
  const category = await prisma.ebookCategory.findFirst();
  if (!category) {
    console.log("No category found.");
    return;
  }
  
  console.log("Category ID:", category.id);
  
  try {
    const ebook = await prisma.ebook.create({
      data: {
        title: "Test Ebook 1",
        author: "Test Author",
        year: "2023",
        genre: "Test Genre",
        filePath: "/uploads/ebooks/test1.pdf",
        categories: {
          create: [{ categoryId: category.id }]
        }
      }
    });
    console.log("Created first ebook:", ebook.id);

    const ebook2 = await prisma.ebook.create({
      data: {
        title: "Test Ebook 2",
        author: "Test Author",
        year: "2023",
        genre: "Test Genre",
        filePath: "/uploads/ebooks/test2.pdf",
        categories: {
          create: [{ categoryId: category.id }]
        }
      }
    });
    console.log("Created second ebook:", ebook2.id);

    // Check category relations
    const cat = await prisma.ebookCategory.findUnique({
      where: { id: category.id },
      include: {
        ebooks: true
      }
    });
    console.log("Category ebooks count:", cat.ebooks.length);

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
