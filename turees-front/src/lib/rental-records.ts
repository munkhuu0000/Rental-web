"use client";

export type RentalDirection = "LEASE_OUT" | "LEASE_IN";
export type RentalMovementType = "OUT" | "RETURN";

export type RentalRecord = {
  id: string;
  direction: RentalDirection;
  movementType?: RentalMovementType;
  date: string;
  party: string;
  companyId?: string;
  companyName?: string;
  material: string;
  quantity: number;
  returned: number;
  unitPrice: number;
  durationDays: number;
  note: string;
};

export type RentalFilters = {
  dateFrom: string;
  dateTo: string;
  direction: string;
  party: string;
  material: string;
};

export type CompanyOption = {
  id: string;
  name: string;
  registerNumber?: string;
  phone?: string;
  email?: string;
};

export const RENTAL_RECORDS_STORAGE_KEY = "turees-rental-records-v1";
export const RENTAL_COMPANIES_STORAGE_KEY = "turees-rental-companies-v1";

export const initialRentals: RentalRecord[] = [
  {
    id: "rental-1",
    direction: "LEASE_OUT",
    movementType: "OUT",
    date: "2026-05-22",
    party: "Эрдэнэт Барилга ХХК",
    companyName: "Эрдэнэт Барилга ХХК",
    material: "Хэв хашмал",
    quantity: 240,
    returned: 120,
    unitPrice: 1200,
    durationDays: 14,
    note: "А блок",
  },
  {
    id: "rental-2",
    direction: "LEASE_OUT",
    movementType: "OUT",
    date: "2026-05-20",
    party: "Алтан Гэр ХХК",
    companyName: "Алтан Гэр ХХК",
    material: "Тулаас",
    quantity: 500,
    returned: 40,
    unitPrice: 900,
    durationDays: 20,
    note: "Суурийн ажил",
  },
  {
    id: "rental-3",
    direction: "LEASE_IN",
    movementType: "OUT",
    date: "2026-05-19",
    party: "Хан Констракшн",
    companyName: "Хан Констракшн",
    material: "Шат",
    quantity: 18,
    returned: 6,
    unitPrice: 1500,
    durationDays: 10,
    note: "Дотоод хэрэгцээ",
  },
];

export const emptyRentalFilters: RentalFilters = {
  dateFrom: "",
  dateTo: "",
  direction: "",
  party: "",
  material: "",
};

export function directionLabel(direction: RentalDirection) {
  return direction === "LEASE_OUT" ? "Түрээслүүлэх" : "Түрээслэх";
}

export function formatMoney(value: number) {
  return `${value.toLocaleString()} ₮`;
}

export function uniqueOptions(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "mn-MN"),
  );
}

export function remaining(record: RentalRecord) {
  if (record.movementType === "RETURN") {
    return -Math.abs(record.quantity);
  }

  if (record.movementType === "OUT") {
    return Math.max(record.quantity, 0);
  }

  return Math.max(record.quantity - record.returned, 0);
}

export function lineTotal(record: RentalRecord) {
  if (record.movementType === "RETURN") {
    return 0;
  }

  return record.quantity * record.unitPrice * Math.max(record.durationDays, 1);
}

export function accountingParty(record: RentalRecord) {
  return record.companyName?.trim() || record.party.trim();
}

export function accountingPartyKey(record: RentalRecord) {
  return record.companyId || accountingParty(record).toLowerCase();
}

export function matchesRentalFilters(record: RentalRecord, filters: RentalFilters) {
  if (filters.dateFrom && record.date < filters.dateFrom) {
    return false;
  }

  if (filters.dateTo && record.date > filters.dateTo) {
    return false;
  }

  if (filters.direction && record.direction !== filters.direction) {
    return false;
  }

  if (filters.party && accountingPartyKey(record) !== filters.party) {
    return false;
  }

  if (filters.material && record.material !== filters.material) {
    return false;
  }

  return true;
}

export function loadRentalRecords() {
  if (typeof window === "undefined") {
    return initialRentals;
  }

  try {
    const stored = window.localStorage.getItem(RENTAL_RECORDS_STORAGE_KEY);
    if (!stored) {
      return initialRentals;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as RentalRecord[]) : initialRentals;
  } catch {
    return initialRentals;
  }
}

export function saveRentalRecords(records: RentalRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RENTAL_RECORDS_STORAGE_KEY,
    JSON.stringify(records),
  );
}

export function loadRentalCompanies() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(RENTAL_COMPANIES_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as CompanyOption[]) : [];
  } catch {
    return [];
  }
}

export function saveRentalCompanies(companies: CompanyOption[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    RENTAL_COMPANIES_STORAGE_KEY,
    JSON.stringify(companies),
  );
}
