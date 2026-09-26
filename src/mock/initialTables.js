export const INITIAL_TABLES = [
  // SECTOR INTERIOR
  {
    id: 't-1',
    number: '01',
    name: 'Mesa 01',
    sector: 'INTERIOR',
    capacity: 4,
    pax: 0,
    status: 'free',
    waiter: null,
    elapsedMinutes: 0,
    openedAt: null,
    activeOrder: [],
    kitchenNotes: ''
  },
  {
    id: 't-2',
    number: '02',
    name: 'Mesa 02',
    sector: 'INTERIOR',
    capacity: 4,
    pax: 2,
    status: 'occupied',
    waiter: 'Admin (Dueño)',
    elapsedMinutes: 35,
    openedAt: '20:00',
    activeOrder: [
      { id: 'p-1', name: 'Cerveza de la Casa', price: 1500, quantity: 2, notes: '' },
      { id: 'p-9', name: 'Hamburguesa Clásica', price: 4500, quantity: 1, notes: '' }
    ],
    kitchenNotes: ''
  },

  // SECTOR EXTERIOR
  {
    id: 't-3',
    number: '03',
    name: 'Mesa Exterior 03',
    sector: 'EXTERIOR',
    capacity: 6,
    pax: 4,
    status: 'waiting_bill',
    waiter: 'Admin (Dueño)',
    elapsedMinutes: 55,
    openedAt: '19:30',
    activeOrder: [
      { id: 'p-7', name: 'Trago de la Casa', price: 2500, quantity: 2, notes: '' },
      { id: 'p-13', name: 'Pizza Muzzarella', price: 5000, quantity: 1, notes: '' }
    ],
    kitchenNotes: ''
  },

  // SECTOR BARRA
  {
    id: 't-4',
    number: 'B-01',
    name: 'Barra 01',
    sector: 'BARRA',
    capacity: 2,
    pax: 1,
    status: 'occupied',
    waiter: 'Admin (Dueño)',
    elapsedMinutes: 15,
    openedAt: '20:20',
    activeOrder: [
      { id: 'p-5', name: 'Trago Corto', price: 2000, quantity: 1, notes: '' }
    ],
    kitchenNotes: ''
  }
];
