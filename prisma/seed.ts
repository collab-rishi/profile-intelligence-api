import { PrismaClient } from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  
  const filePath = path.join(__dirname, 'data/profiles.json');
  
  if (!fs.existsSync(filePath)) {
    console.error("Error: Seed data file not found at prisma/data/profiles.json");
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
 const parsed = JSON.parse(rawData);
const profiles = parsed.profiles;

  console.log(`🚀 Starting seed process for ${profiles.length} profiles...`);

  
  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { name: profile.name },
      update: {}, 
      create: {
        id: uuidv7(),
        name: profile.name,
        gender: profile.gender,
        gender_probability: profile.gender_probability,
        age: profile.age,
        age_group: profile.age_group,
        country_id: profile.country_id,
        country_name: profile.country_name,
        country_probability: profile.country_probability,
        created_at: new Date(profile.created_at || new Date()),
      },
    });
  }

  console.log('✅ Seeding completed. Database is ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });