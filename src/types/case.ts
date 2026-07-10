// ==================== Enums ====================

/** 案件類型 */
export enum CaseType {
  REGULAR = "REGULAR",                       // 一般案件（走 5 階段）
  TRANSFER_OUT = "TRANSFER_OUT",             // 轉出
  DATA_UPDATE = "DATA_UPDATE",               // 資料異動
  CHANGE_EMPLOYER = "CHANGE_EMPLOYER",       // 更換雇主
  CHANGE_CAREGIVER = "CHANGE_CAREGIVER",     // 更換被照顧人
}

/** 一般案件的流程階段 */
export enum CaseProcess {
  JOB_POSTING = "JOB_POSTING",               // 求才登記
  RECRUIT_PERMIT = "RECRUIT_PERMIT",         // 招募許可
  HIRE_PERMIT = "HIRE_PERMIT",               // 聘僱許可
  RESIDENCE_CARD = "RESIDENCE_CARD",         // 居留證
  LABOR_CONTRACT = "LABOR_CONTRACT",         // 勞動契約
}

/** 案件整體狀態 */
export enum CaseStatus {
  PROCESSING = "PROCESSING",                 // 處理中
  ON_HOLD = "ON_HOLD",                       // 暫停
  COMPLETED = "COMPLETED",                   // 已結案
  CANCELLED = "CANCELLED",                   // 已取消
}

/** 目標國家 */
export enum Country {
  INDONESIA = "INDONESIA",
  VIETNAM = "VIETNAM",
  PHILIPPINES = "PHILIPPINES",
  THAILAND = "THAILAND",
  OTHER = "OTHER",
}

// ==================== 案件主體 ====================

export interface Case {
  // 識別
  id: string;
  caseNumber: string;                        // 人類可讀案號 e.g. "2026-0042"

  // 案件類型（決定要不要走 5 階段流程）
  caseType: CaseType;

  // 雇主資訊
  employer: string;
  employerPhone: string;
  employerContact?: string;

  // 外勞資訊
  applicantName?: string;
  country: Country;

  // 案件說明
  cause: string;                             // 案件事由 / 說明

  // 流程狀態（**只有 REGULAR 才有值**，其他類型為 null）
  currentProcess: CaseProcess | null;

  // 整體狀態
  status: CaseStatus;

  // 責任歸屬
  assigneeId: string;

  // 跟進提醒
  nextActionDate?: Date;
  nextActionNote?: string;

  // 備註
  notes?: string;

  // 時間戳
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;

  // 關聯（讀取時 include）
  events?: CaseEvent[];
}

// ==================== 事件歷史 ====================

export interface CaseEvent {
  id: string;
  caseId: string;
  process: CaseProcess | null;               // 事件發生時的階段（特殊案件為 null）
  action: string;                            // 動作描述
  note?: string;
  actorId: string;
  createdAt: Date;
}

// ==================== 業務邏輯常數 ====================

/** 一般案件的階段順序（用於 auto-advance） */
export const REGULAR_PROCESS_ORDER: CaseProcess[] = [
  CaseProcess.JOB_POSTING,
  CaseProcess.RECRUIT_PERMIT,
  CaseProcess.HIRE_PERMIT,
  CaseProcess.RESIDENCE_CARD,
  CaseProcess.LABOR_CONTRACT,
];

/**
 * 每個階段的預期工作天數
 * 用於進到新階段時，自動計算 nextActionDate 提醒
 * ⚠️ 數字先填 12，實際天數請跟業務確認後修正
 */
export const PROCESS_EXPECTED_DAYS: Record<CaseProcess, number> = {
  JOB_POSTING: 7,
  RECRUIT_PERMIT: 12,
  HIRE_PERMIT: 12,
  RESIDENCE_CARD: 12,
  LABOR_CONTRACT: 7,
};

// ==================== Helper 函式 ====================

/**
 * 取得下一個階段
 * @returns 下一個階段，如果已在最後階段回傳 null
 */
export function getNextProcess(current: CaseProcess): CaseProcess | null {
  const idx = REGULAR_PROCESS_ORDER.indexOf(current);
  if (idx === -1 || idx === REGULAR_PROCESS_ORDER.length - 1) {
    return null;
  }
  return REGULAR_PROCESS_ORDER[idx + 1];
}

/**
 * 加上工作天數（跳過週末，不含國定假日）
 * 之後要加國定假日，把 holidays 陣列傳進來比對
 */
export function addWorkingDays(from: Date, days: number): Date {
  const result = new Date(from);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;   // 跳過週日(0)、週六(6)
  }
  return result;
}