import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function test() {
  const user = await prisma.user.findUnique({ where: { email: "admin@yaladiary.com" } });
  const match = await bcrypt.compare("Admin@2026!", user.password || "");
  console.log("Password Match:", match);
  process.exit(match ? 0 : 1);
}
test();
