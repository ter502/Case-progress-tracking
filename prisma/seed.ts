import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. 用 bcrypt 把明文密碼變 hash
  const plainPassword = "DHSC";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // 2. 寫入或更新管理員帳號
  const admin = await prisma.user.upsert({
    where: { email: "admin@dhsc.local" },
    update: {},                                // 已存在就不動
    create: {
      email: "yute_lin@tcnr.org.tw",
      name: "系統管理員",
      passwordHash,
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });

  console.log("✅ 已建立管理員：", admin.email);
  console.log("🔑 預設密碼：", plainPassword, "（請首次登入後更改）");
}

main()
  .catch((e) => {
    console.error("❌ Seed 失敗：", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });