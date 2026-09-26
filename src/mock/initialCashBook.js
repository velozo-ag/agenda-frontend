export const INITIAL_CASH_BOOK = [
  // Turno Actual (SHIFT-2026-0808-01)
  {
    id: 'mov-105',
    date: '2026-08-08',
    time: '20:30',
    type: 'ENTRADA',
    category: 'Ingreso Manual',
    description: 'Ingreso de cambio para caja',
    amount: 10000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0808-01'
  },
  {
    id: 'mov-104',
    date: '2026-08-08',
    time: '20:05',
    type: 'SALIDA',
    category: 'Gastos / Proveedores',
    description: 'Pago a proveedor de panadería',
    amount: 5000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0808-01'
  },
  {
    id: 'mov-103',
    date: '2026-08-08',
    time: '19:40',
    type: 'ENTRADA',
    category: 'Venta / Comanda',
    description: 'Cobro en efectivo Barra 02 (Ticket #TKT-00894)',
    amount: 4800,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0808-01'
  },
  {
    id: 'mov-102',
    date: '2026-08-08',
    time: '19:15',
    type: 'SALIDA',
    category: 'Gastos / Proveedores',
    description: 'Compra de insumos menores',
    amount: 2500,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0808-01'
  },
  {
    id: 'mov-101',
    date: '2026-08-08',
    time: '18:00',
    type: 'ENTRADA',
    category: 'Fondo Inicial',
    description: 'Apertura de turno y fondo de cambio',
    amount: 50000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0808-01'
  },

  // Turno Anterior (SHIFT-2026-0807-01)
  {
    id: 'mov-95',
    date: '2026-08-07',
    time: '02:30',
    type: 'SALIDA',
    category: 'Cierre de Turno',
    description: 'Cierre de turno y retiro de caja',
    amount: 95000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0807-01'
  },
  {
    id: 'mov-94',
    date: '2026-08-07',
    time: '23:45',
    type: 'ENTRADA',
    category: 'Venta / Comanda',
    description: 'Cobro en efectivo Mesa 06 (Ticket #TKT-00889)',
    amount: 25000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0807-01'
  },
  {
    id: 'mov-93',
    date: '2026-08-07',
    time: '22:10',
    type: 'SALIDA',
    category: 'Gastos / Proveedores',
    description: 'Compra de insumos de verdulería',
    amount: 3000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0807-01'
  },
  {
    id: 'mov-92',
    date: '2026-08-07',
    time: '21:00',
    type: 'ENTRADA',
    category: 'Venta / Comanda',
    description: 'Cobro en efectivo Mesa 01 (Ticket #TKT-00884)',
    amount: 20000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0807-01'
  },
  {
    id: 'mov-91',
    date: '2026-08-07',
    time: '18:00',
    type: 'ENTRADA',
    category: 'Fondo Inicial',
    description: 'Apertura de turno y fondo de cambio',
    amount: 50000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0807-01'
  },

  // Turno del 2026-08-06 (SHIFT-2026-0806-01)
  {
    id: 'mov-85',
    date: '2026-08-06',
    time: '02:15',
    type: 'SALIDA',
    category: 'Cierre de Turno',
    description: 'Cierre de turno y retiro de caja',
    amount: 70000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0806-01'
  },
  {
    id: 'mov-84',
    date: '2026-08-06',
    time: '23:10',
    type: 'ENTRADA',
    category: 'Venta / Comanda',
    description: 'Cobro en efectivo Mesa 04 (Ticket #TKT-00878)',
    amount: 20000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0806-01'
  },
  {
    id: 'mov-83',
    date: '2026-08-06',
    time: '21:30',
    type: 'SALIDA',
    category: 'Gastos / Proveedores',
    description: 'Mantenimiento e insumos',
    amount: 5000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0806-01'
  },
  {
    id: 'mov-82',
    date: '2026-08-06',
    time: '20:15',
    type: 'ENTRADA',
    category: 'Venta / Comanda',
    description: 'Cobro en efectivo Patio 02 (Ticket #TKT-00872)',
    amount: 15000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0806-01'
  },
  {
    id: 'mov-81',
    date: '2026-08-06',
    time: '18:00',
    type: 'ENTRADA',
    category: 'Fondo Inicial',
    description: 'Apertura de turno y fondo de cambio',
    amount: 40000,
    paymentMethod: 'EFECTIVO',
    user: 'Admin (Dueño)',
    shiftId: 'SHIFT-2026-0806-01'
  }
];
