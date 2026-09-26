export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1001',
    ticketNumber: 'TKT-00892',
    tableName: 'Mesa 03',
    waiter: 'Admin (Dueño)',
    openedAt: '18:30',
    closedAt: '19:42',
    durationMinutes: 72,
    pax: 4,
    itemsCount: 7,
    itemsSummary: '4x Cerveza de la Casa, 2x Hamburguesa Clásica, 1x Papas Fritas',
    subtotal: 17500,
    tip: 0,
    discount: 0,
    total: 17500,
    paymentMethod: 'TARJETA',
    status: 'COBRADO',
    details: [
      { name: 'Cerveza de la Casa', quantity: 4, price: 1500, total: 6000 },
      { name: 'Hamburguesa Clásica', quantity: 2, price: 4500, total: 9000 },
      { name: 'Papas Fritas', quantity: 1, price: 2500, total: 2500 }
    ]
  },
  {
    id: 'tx-1002',
    ticketNumber: 'TKT-00893',
    tableName: 'Mesa Exterior 03',
    waiter: 'Admin (Dueño)',
    openedAt: '18:45',
    closedAt: '19:55',
    durationMinutes: 70,
    pax: 2,
    itemsCount: 4,
    itemsSummary: '2x Trago de la Casa, 1x Pizza Muzzarella, 1x Postre del Día',
    subtotal: 12500,
    tip: 0,
    discount: 0,
    total: 12500,
    paymentMethod: 'QR_MERCADOPAGO',
    status: 'COBRADO',
    details: [
      { name: 'Trago de la Casa', quantity: 2, price: 2500, total: 5000 },
      { name: 'Pizza Muzzarella', quantity: 1, price: 5000, total: 5000 },
      { name: 'Postre del Día', quantity: 1, price: 2500, total: 2500 }
    ]
  },
  {
    id: 'tx-1003',
    ticketNumber: 'TKT-00894',
    tableName: 'Barra 02',
    waiter: 'Admin (Dueño)',
    openedAt: '19:10',
    closedAt: '19:40',
    durationMinutes: 30,
    pax: 1,
    itemsCount: 2,
    itemsSummary: '1x Trago Corto, 1x Entrada del Día',
    subtotal: 4800,
    tip: 0,
    discount: 0,
    total: 4800,
    paymentMethod: 'EFECTIVO',
    status: 'COBRADO',
    details: [
      { name: 'Trago Corto', quantity: 1, price: 2000, total: 2000 },
      { name: 'Entrada del Día', quantity: 1, price: 2800, total: 2800 }
    ]
  }
];

export const INITIAL_CASH_REGISTER = {
  shiftId: 'SHIFT-2026-0808-01',
  isOpen: true,
  openingAmount: 50000,
  openedAt: '18:00 hs (Hoy)',
  cashierName: 'Admin (Dueño)',
  salesCash: 4800,
  salesCard: 17500,
  salesQR: 12500,
  salesMixed: 0,
  totalSales: 34800,
  expectedCashInDrawer: 54800 // 50000 fondo + 4800 ventas efectivo
};

export const INITIAL_SHIFT_HISTORY = [
  {
    id: 'shift-z-098',
    zNumber: 'Z-00098',
    date: '2026-08-07',
    openedAt: '18:00 hs',
    closedAt: '02:30 hs',
    cashierName: 'Admin (Dueño)',
    openingAmount: 50000,
    totalSales: 120000,
    salesCash: 45000,
    salesCard: 50000,
    salesQR: 25000,
    expectedCash: 95000,
    countedCash: 95000,
    difference: 0,
    status: 'CUADRADO'
  },
  {
    id: 'shift-z-097',
    zNumber: 'Z-00097',
    date: '2026-08-06',
    openedAt: '18:00 hs',
    closedAt: '02:15 hs',
    cashierName: 'Admin (Dueño)',
    openingAmount: 40000,
    totalSales: 95000,
    salesCash: 35000,
    salesCard: 40000,
    salesQR: 20000,
    expectedCash: 75000,
    countedCash: 75500,
    difference: 500,
    status: 'SOBRANTE'
  },
  {
    id: 'shift-z-096',
    zNumber: 'Z-00096',
    date: '2026-08-05',
    openedAt: '18:00 hs',
    closedAt: '01:45 hs',
    cashierName: 'Admin (Dueño)',
    openingAmount: 40000,
    totalSales: 80000,
    salesCash: 30000,
    salesCard: 35000,
    salesQR: 15000,
    expectedCash: 70000,
    countedCash: 70000,
    difference: 0,
    status: 'CUADRADO'
  }
];
