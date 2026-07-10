"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  CaseType,
  CaseStatus,
  getNextProcess,
  addWorkingDays,
  PROCESS_EXPECTED_DAYS,
} from "@/types/case";
import { PROCESS_LABELS } from "@/lib/case-labels";

/**
 * 完成當前階段，自動推進到下一階段
 */
export async function completeCurrentProcess(caseId: string, note: string) {
  // 1. 檢查登入
  const session = await auth();
  if (!session?.user) throw new Error("未登入");

  // 2. 撈案件
  const caseData = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseData) throw new Error("案件不存在");
  if (caseData.caseType !== CaseType.REGULAR) {
    throw new Error("只有一般案件能推進流程");
  }
  if (!caseData.currentProcess) throw new Error("案件已無進行中階段");

  // 3. 權限：只有負責人或 ADMIN 能推進
  const canEdit =
    session.user.id === caseData.assigneeId ||
    session.user.role === "ADMIN";
  if (!canEdit) throw new Error("沒有權限");

  // 4. 記錄「完成」事件
  await prisma.caseEvent.create({
    data: {
      caseId,
      process: caseData.currentProcess,
      action: `完成 ${PROCESS_LABELS[caseData.currentProcess]}`,
      note,
      actorId: session.user.id,
    },
  });

  // 5. 決定下一階段
  const next = getNextProcess(caseData.currentProcess);

  if (!next) {
    // 已到最後一階段（勞動契約）→ 結案
    await prisma.case.update({
      where: { id: caseId },
      data: {
        status: CaseStatus.COMPLETED,
        closedAt: new Date(),
        currentProcess: null,
        nextActionDate: null,
      },
    });
  } else {
    // 推進到下一階段
    await prisma.case.update({
      where: { id: caseId },
      data: {
        currentProcess: next,
        nextActionDate: addWorkingDays(new Date(), PROCESS_EXPECTED_DAYS[next]),
        nextActionNote: `${PROCESS_LABELS[next]} 待處理`,
      },
    });
  }

  // 6. 讓相關頁面重新讀取資料
  revalidatePath("/home");
  revalidatePath(`/cases/${caseId}`);
}