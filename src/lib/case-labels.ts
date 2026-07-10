import { CaseType, CaseProcess, CaseStatus, Country } from "@/types/case";

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  REGULAR: "一般案件",
  TRANSFER_OUT: "轉出",
  DATA_UPDATE: "資料異動",
  CHANGE_EMPLOYER: "更換雇主",
  CHANGE_CAREGIVER: "更換被照顧人",
};

export const PROCESS_LABELS: Record<CaseProcess, string> = {
  JOB_POSTING: "求才登記",
  RECRUIT_PERMIT: "招募許可",
  HIRE_PERMIT: "聘僱許可",
  RESIDENCE_CARD: "居留證",
  LABOR_CONTRACT: "勞動契約",
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  PROCESSING: "處理中",
  ON_HOLD: "暫停",
  COMPLETED: "已結案",
  CANCELLED: "已取消",
};

export const COUNTRY_LABELS: Record<Country, string> = {
  INDONESIA: "印尼",
  VIETNAM: "越南",
  PHILIPPINES: "菲律賓",
  THAILAND: "泰國",
  OTHER: "其他",
};