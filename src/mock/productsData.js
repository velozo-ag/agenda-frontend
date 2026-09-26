export const PRODUCT_CATEGORIES = [
  { id: 'ALL', name: 'Todos los Productos' },
  { id: 'CERVEZAS', name: 'Cervezas & Chopps' },
  { id: 'TRAGOS', name: 'Coctelería & Tragos' },
  { id: 'BURGUERS', name: 'Hamburguesas & Sándwiches' },
  { id: 'PIZZAS', name: 'Pizzas & Empanadas' },
  { id: 'PICADAS', name: 'Para Picar & Entradas' },
  { id: 'BEBIDAS', name: 'Sin Alcohol' },
  { id: 'CAFETERIA', name: 'Cafetería & Postres' }
];

export const PRODUCTS_CATALOG = [
  // Cervezas
  {
    id: 'p-1',
    name: 'Cerveza de la Casa',
    category: 'CERVEZAS',
    price: 1500,
    description: '500ml - Pinta de cerveza tirada de la canilla',
    tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-2',
    name: 'Cerveza en Botella',
    category: 'CERVEZAS',
    price: 1800,
    description: '330ml - Botella fría individual',
    tags: [],
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-3',
    name: 'Cerveza Artesanal',
    category: 'CERVEZAS',
    price: 2200,
    description: '500ml - Cerveza artesanal del turno',
    tags: ['Artesanal'],
    image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-4',
    name: 'Cerveza Importada',
    category: 'CERVEZAS',
    price: 2600,
    description: '330ml - Botella importada fría',
    tags: ['Importada'],
    image: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },

  // Tragos & Coctelería
  {
    id: 'p-5',
    name: 'Trago Corto',
    category: 'TRAGOS',
    price: 2000,
    description: 'Destilado solo o con soda',
    tags: [],
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-6',
    name: 'Trago Largo',
    category: 'TRAGOS',
    price: 2500,
    description: 'Destilado con gaseosa o agua tónica',
    tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-7',
    name: 'Trago de la Casa',
    category: 'TRAGOS',
    price: 2500,
    description: 'Cóctel especial de la carta',
    tags: ['Destacado'],
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-8',
    name: 'Cóctel Clásico',
    category: 'TRAGOS',
    price: 3000,
    description: 'Preparación clásica con ingredientes frescos',
    tags: ['Recomendado'],
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },

  // Hamburguesas & Sándwiches
  {
    id: 'p-9',
    name: 'Hamburguesa Clásica',
    category: 'BURGUERS',
    price: 4500,
    description: 'Medallón de carne, lechuga, tomate y queso',
    tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-10',
    name: 'Hamburguesa Doble',
    category: 'BURGUERS',
    price: 5500,
    description: 'Doble medallón con queso y aderezo de la casa',
    tags: ['Más Pedida'],
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-11',
    name: 'Sándwich de la Casa',
    category: 'BURGUERS',
    price: 4800,
    description: 'Sándwich caliente con relleno del día',
    tags: ['Recomendado'],
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-12',
    name: 'Sándwich Vegetariano',
    category: 'BURGUERS',
    price: 4200,
    description: 'Sin carne, con vegetales de estación',
    tags: ['Vegetariano'],
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },

  // Pizzas & Empanadas
  {
    id: 'p-13',
    name: 'Pizza Muzzarella',
    category: 'PIZZAS',
    price: 5000,
    description: 'Pizza entera con salsa y queso muzzarella',
    tags: ['Para Compartir'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-14',
    name: 'Pizza Especial',
    category: 'PIZZAS',
    price: 6000,
    description: 'Pizza con ingredientes de la carta del día',
    tags: ['Destacada'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-15',
    name: 'Empanadas (x3)',
    category: 'PIZZAS',
    price: 2200,
    description: '3 unidades de empanadas del día',
    tags: ['Tradicional'],
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },

  // Picadas & Entradas
  {
    id: 'p-16',
    name: 'Papas Fritas',
    category: 'PICADAS',
    price: 2500,
    description: 'Porción de papas fritas crocantes',
    tags: ['Popular'],
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-17',
    name: 'Picada para Compartir',
    category: 'PICADAS',
    price: 6000,
    description: 'Tabla con fiambres, quesos y acompañamientos',
    tags: ['Para Compartir'],
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-18',
    name: 'Entrada del Día',
    category: 'PICADAS',
    price: 2800,
    description: 'Entrada rápida según disponibilidad',
    tags: [],
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },

  // Sin Alcohol
  {
    id: 'p-19',
    name: 'Limonada',
    category: 'BEBIDAS',
    price: 1800,
    description: 'Limonada natural recién exprimida',
    tags: ['Sin Alcohol'],
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-20',
    name: 'Gaseosa',
    category: 'BEBIDAS',
    price: 1200,
    description: 'Lata o botella 500ml',
    tags: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-21',
    name: 'Agua Mineral',
    category: 'BEBIDAS',
    price: 1000,
    description: 'Con o sin gas',
    tags: [],
    image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },

  // Cafetería & Postres
  {
    id: 'p-22',
    name: 'Postre del Día',
    category: 'CAFETERIA',
    price: 2500,
    description: 'Postre casero según disponibilidad',
    tags: ['Casero'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-23',
    name: 'Postre Clásico',
    category: 'CAFETERIA',
    price: 2200,
    description: 'Postre tradicional de la carta',
    tags: [],
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=300&auto=format&fit=crop&q=80',
    stock: 99
  },
  {
    id: 'p-24',
    name: 'Café',
    category: 'CAFETERIA',
    price: 1200,
    description: 'Café simple, doble o cortado',
    tags: [],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
    stock: 99
  }
];
