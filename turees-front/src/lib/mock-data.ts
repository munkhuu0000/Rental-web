export const dashboardStats = [
  {
    title: "Нийт авлага",
    value: "38,217,000₮",
    helper: "өмнөх сартай харьцуулахад",
    trend: "↑ 12.4%",
    tone: "success",
  },
  {
    title: "Идэвхтэй түрээс",
    value: "5",
    helper: "одоогоор хүчинтэй",
    trend: "",
    tone: "success",
  },
  {
    title: "Хугацаа хэтэрсэн",
    value: "2",
    helper: "шуурхай арга хэмжээ авах уу",
    trend: "↓ 2",
    tone: "danger",
  },
  {
    title: "Энэ сарын нэхэмжлэл",
    value: "16,051,140₮",
    helper: "",
    trend: "↑ 8.1%",
    tone: "success",
  },
  {
    title: "Материалын үлдэгдэл",
    value: "727 ш",
    helper: "агуулахад байгаа",
    trend: "",
    tone: "warning",
    href: "/materials",
  },
];

export const materialCards: Array<{
  name: string;
  unit: string;
  total: number;
  rented: number;
  remaining: number;
  incomeMovements: Array<{
    id: string;
    materialId: string;
    movementType: "RETURN";
    movementDate: string;
    quantity: number;
  }>;
  expenseMovements: Array<{
    id: string;
    materialId: string;
    movementType: "OUT";
    movementDate: string;
    quantity: number;
  }>;
  price: string;
  status: string;
  tone: "success" | "warning";
}> = [
  {
    name: "Хэв хашмал",
    unit: "ширхэг",
    total: 800,
    rented: 540,
    remaining: 260,
    incomeMovements: [
      { id: "formwork-income-1", materialId: "formwork", movementType: "RETURN", movementDate: "2026-05-18", quantity: 500 },
      { id: "formwork-income-2", materialId: "formwork", movementType: "RETURN", movementDate: "2026-05-24", quantity: 300 },
    ],
    expenseMovements: [
      { id: "formwork-expense-1", materialId: "formwork", movementType: "OUT", movementDate: "2026-05-20", quantity: 240 },
      { id: "formwork-expense-2", materialId: "formwork", movementType: "OUT", movementDate: "2026-05-22", quantity: 300 },
    ],
    price: "1,200₮",
    status: "Бэлэн",
    tone: "success",
  },
  {
    name: "Тулаас",
    unit: "ширхэг",
    total: 1200,
    rented: 1100,
    remaining: 100,
    incomeMovements: [
      { id: "support-income-1", materialId: "support", movementType: "RETURN", movementDate: "2026-05-15", quantity: 700 },
      { id: "support-income-2", materialId: "support", movementType: "RETURN", movementDate: "2026-05-21", quantity: 500 },
    ],
    expenseMovements: [
      { id: "support-expense-1", materialId: "support", movementType: "OUT", movementDate: "2026-05-20", quantity: 500 },
      { id: "support-expense-2", materialId: "support", movementType: "OUT", movementDate: "2026-05-23", quantity: 600 },
    ],
    price: "900₮",
    status: "Бага үлдсэн",
    tone: "warning",
  },
  {
    name: "Шат",
    unit: "ширхэг",
    total: 60,
    rented: 18,
    remaining: 42,
    incomeMovements: [
      { id: "scaffold-income-1", materialId: "scaffold", movementType: "RETURN", movementDate: "2026-05-16", quantity: 60 },
    ],
    expenseMovements: [
      { id: "scaffold-expense-1", materialId: "scaffold", movementType: "OUT", movementDate: "2026-05-19", quantity: 18 },
    ],
    price: "1,500₮",
    status: "Бэлэн",
    tone: "success",
  },
  {
    name: "Фанер",
    unit: "хуудас",
    total: 400,
    rented: 215,
    remaining: 185,
    incomeMovements: [
      { id: "plywood-income-1", materialId: "plywood", movementType: "RETURN", movementDate: "2026-05-17", quantity: 250 },
      { id: "plywood-income-2", materialId: "plywood", movementType: "RETURN", movementDate: "2026-05-23", quantity: 150 },
    ],
    expenseMovements: [
      { id: "plywood-expense-1", materialId: "plywood", movementType: "OUT", movementDate: "2026-05-21", quantity: 215 },
    ],
    price: "700₮",
    status: "Бэлэн",
    tone: "success",
  },
];

export const customers = [
  ["Б. Болд", "Эрдэнэт Барилга ХХК", "9911-2233", 2, "22,920,000₮"],
  ["Д. Дорж", "Алтан Гэр ХХК", "9922-3344", 1, "12,915,000₮"],
  ["Н. Нараа", "Хан Констракшн", "9933-4455", 1, "2,184,000₮"],
  ["С. Сүхээ", "Од Билдинг ХХК", "9944-5566", 0, "0₮"],
  ["Г. Ганаа", "Шинэ Гэр ХХК", "9955-6677", 1, "198,000₮"],
];

export const rentals = [
  {
    renter: "Эрдэнэт Барилга ХХК",
    material: "Хэв хашмал",
    out: 240,
    returned: 120,
    remaining: 120,
    date: "2026-05-22",
  },
  {
    renter: "Алтан Гэр ХХК",
    material: "Тулаас",
    out: 500,
    returned: 40,
    remaining: 460,
    date: "2026-05-20",
  },
  {
    renter: "Хан Констракшн",
    material: "Шат",
    out: 18,
    returned: 6,
    remaining: 12,
    date: "2026-05-19",
  },
];

export const returns = [
  ["2026-05-24", "Эрдэнэт Барилга ХХК", "Хэв хашмал", "30 ш", "Бүрэн"],
  ["2026-05-23", "Алтан Гэр ХХК", "Тулаас", "20 ш", "Шалгаж байна"],
  ["2026-05-21", "Хан Констракшн", "Шат", "6 ш", "Бүрэн"],
];

export const invoices = [
  ["INV-24051", "Эрдэнэт Барилга ХХК", "15,900,000₮", "Илгээсэн"],
  ["INV-24052", "Алтан Гэр ХХК", "11,210,000₮", "Хүлээгдэж буй"],
  ["INV-24053", "Хан Констракшн", "2,184,000₮", "Төлөгдсөн"],
];

export const reports = [
  ["Өдрийн тайлан", "Өнөөдрийн өгсөн, авсан хөдөлгөөн"],
  ["Сарын авлагын тайлан", "Нэхэмжлэл, төлөлтийн нэгтгэл"],
  ["Үлдэгдлийн тайлан", "Материал тус бүрийн үлдэгдэл"],
];
