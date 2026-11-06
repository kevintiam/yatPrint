/**
 * Crée un compte admin, ou change le mot de passe d'un compte existant.
 * Pratique si Gessica oublie son mot de passe (il se change aussi dans /admin/reglages).
 *
 * Utilisation :
 *   npm run admin:create -- courriel@exemple.com "MotDePasseSolide2026" "Prénom"
 * Sans arguments, le script utilise ADMIN_EMAIL, ADMIN_PASSWORD et ADMIN_NAME du fichier .env.
 */
import bcrypt from "bcryptjs";
import { getPrisma, disconnectPrisma } from "../src/lib/db/prisma.js";

async function main() {
  const [emailArgument, passwordArgument, nameArgument] = process.argv.slice(2);
  const email = (emailArgument || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = passwordArgument || process.env.ADMIN_PASSWORD || "";
  const name = nameArgument || process.env.ADMIN_NAME || "Admin";

  if (!email || !email.includes("@")) {
    throw new Error("Courriel manquant ou invalide.");
  }
  if (password.length < 10) {
    throw new Error("Le mot de passe doit contenir au moins 10 caractères.");
  }

  const prisma = getPrisma();
  const passwordHash = await bcrypt.hash(password, 12);

  // upsert : crée le compte s'il n'existe pas, sinon met à jour le nom et le mot de passe
  await prisma.admin.upsert({
    where: { email },
    create: { email, name, passwordHash },
    update: { name, passwordHash },
  });
  console.log(`✅ Compte admin prêt : ${email}`);

  await disconnectPrisma();
}

main().catch(async (error) => {
  console.error(`❌ ${error.message}`);
  await disconnectPrisma();
  process.exit(1);
});
