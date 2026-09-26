# Frontend Specifications (POS System)

## Tecnologías Principales
- **Framework:** React 19
- **Build Tool:** ViteJS 8
- **Estilos:** Tailwind CSS v4 + Tokens CSS para modo oscuro minimalista
- **Iconografía:** Lucide React (línea delgada y sobria)
- **Efectos Visuales:** Canvas Confetti desacoplado para confirmaciones de cobro
- **Enfoque Actual:** Prototipado total de las vistas con arquitectura desacoplada y Mock Data Layer lista para conectar con Spring Boot REST API.

## Directrices de Diseño UI/UX (Estilo Dark Minimalista & Elegante)
- **Tipografía:** Inter (sans-serif sobria) + JetBrains Mono (`num-tabular` para que los importes, vuelto y totales nunca se muevan).
- **Esquema de Colores (Dark Zinc):**
  - **Fondo:** `#09090b` (Zinc 950).
  - **Superficies & Paneles:** `#121215` / `#18181b` con bordes ultrafinos en `#27272a`.
  - **Paleta de Estados (Sobria y sin destellos):**
    - 🟢 **Mesa Libre:** Punto discreto en Verde Esmeralda `#10b981`.
    - 🔴 **Mesa Ocupada:** Punto discreto en Rosa/Cobrizo `#fb7185`.
    - 🟡 **Pidiendo Cuenta:** Punto ámbar sutil `#f59e0b`.
    - ⚪ **Acciones Principales:** Botón sólido en blanco/zinc puro (`bg-zinc-100 text-zinc-950`) de alto contraste.
- **Ergonomía y Protección Antierrores:**
  - Layout compacto con viewport fijo (`h-screen overflow-hidden`), evitando scroll innecesario.
  - **Modales de Confirmación Universales (`ConfirmationModal.jsx`):** Todas las acciones críticas (pedir cuenta, cobrar, vaciar comanda, unir mesas o eliminar) requieren confirmación explícita para evitar cierres o cambios accidentales por toques involuntarios.
  - **Mesas Dinámicas y Modificables:** Capacidad de crear nuevas mesas, editar nombres/sectores/capacidad de sillas (pares e impares) y fusionar mesas (para grupos grandes o familias de 8/10 personas).
  - **Mapa de Hotkeys:**
  - **Navegación Global:** `M` (Spotlight Mesas), `T` (Takeaway / Mostrador), `Alt+1`/`F1` (Mesas), `Alt+2`/`F2` (Comandas), `Alt+3`/`F4` (Libro Diario), `Alt+4`/`F5` (Caja), `Alt+D` (Dashboard).
  - **Terminal POS:** `/` o `Ctrl+K` (Buscador), `↓` / `↑` (Navegar catálogo), `Enter` (Cargar producto seleccionado), `F9` o `Ctrl+Enter` (Cobrar), `F8` (Cocina), `Esc` (Limpiar/Cancelar).
  - **Checkout:** `1` (Efectivo), `2` (Tarjeta), `3` (QR), `4` (Mixto), `Enter` (Confirmar Pago), `Esc` (Volver).
  - **Apertura & Comprobante:** `1..9` (Definir comensales), `Enter` (Confirmar Apertura / Imprimir Ticket), `P` (Imprimir), `Esc` (Cerrar).
  - **Mesas:** `N` (+ Nueva Mesa).

### 5.1. Historial de Cierres & Libro Diario en Acordeón (`ShiftHistoryAccordionItem.jsx`)
- **Diseño en Acordeón Interactivo (Piano UI):**
  - Cada cierre anterior se lista con ID de turno, fecha/horario, responsable, total facturado y badge de arqueo (`Exacto`, `+$X Sobrante`, `-$X Faltante`).
  - Al expandir un turno, despliega su **Balance Financiero completo** (Fondo inicial, ventas por método, gastos, arqueo esperado vs contado, notas).
  - **Libro Diario Integrado por Turno:** Tabla con todos los movimientos (cobros de comandas, gastos a proveedores, retiros) con pestañas de filtro (*Todos, Ventas, Gastos, Ingresos*).
  - **Exportación CSV / Excel:** Genera y descarga un archivo `.csv` formateado con encabezados y balance contable del turno.
  - **Reimpresión Térmica de Cierre:** Genera el comprobante de arqueo en formato térmico 80mm/58mm.
  - **Venta Rápida / Mostrador (Quick Sale):** Módulo de cobro directo al paso sin asignar mesas, con numeración correlativa (`#VR-101`), distintivo en tono ámbar y cobro instantáneo en 1 solo clic.
  - **Barra de Ventas Activas (`ActiveTablesBar.jsx`):** Selector de pastillas táctiles en la terminal para cambiar entre la Venta Rápida y cualquier mesa ocupada en 1 solo toque sin salir del catálogo.
  - **Política de Propinas:** Por defecto **0% (Sin propina)**, con selección voluntaria de `0%`, `10%`, `15%` o monto exacto `Personalizado`.

## Sectores
- **Salón Interior (`INTERIOR`)**
- **Patio Exterior (`EXTERIOR`)**
- **Barra (`BARRA`)**

## Estructura del Proyecto (`/frontend-pos/src`)
```
src/
├── context/
│   └── POSContext.jsx            # State Manager unificado (mesas dinámicas, comanda, catálogo, confirmaciones)
├── mock/
│   ├── productsData.js           # Catálogo con categorías, tags, precios y stock
│   ├── initialTables.js          # 4 Mesas iniciales de ejemplo distribuidas por Interior, Exterior y Barra
│   └── initialTransactions.js    # Historial de ventas y apertura de caja
├── utils/
│   └── confetti.js               # Helper seguro para efectos de celebración
├── components/
│   ├── layout/
│   │   └── Navbar.jsx            # Barra superior sobria con reloj en vivo y selector de rol
│   ├── tables/
│   │   ├── TableCard.jsx         # Tarjetas compactas de mesa con timer, menú de opciones y protección
│   │   ├── OpenTableModal.jsx    # Modal de apertura rápida de mesa (pax y mozo)
│   │   ├── TableManagementModal.jsx # Crear nueva mesa o editar nombre/sillas/sector
│   │   └── MergeTableModal.jsx   # Unir mesas (ej. familia de 8) o transferir comanda de sector
│   ├── pos/
│   │   ├── ProductCatalog.jsx    # Buscador rápido, categorías y grilla limpia
│   │   ├── OrderTicket.jsx       # Comanda interactiva con estética de recibo/factura térmica y propina 0% por defecto
│   │   └── ItemNotesModal.jsx    # Modificadores de cocina rápidos ("Sin sal", "Bien cocido", etc.)
│   ├── checkout/
│   │   └── CheckoutModal.jsx     # Cobro en caja, billetes rápidos, vuelto y split bill
│   ├── common/
│   │   ├── ConfirmationModal.jsx # Modal universal de confirmación antierrores
│   │   ├── ReceiptModal.jsx      # Ticket térmico fiscal imprimible
│   │   └── KitchenNotificationToast.jsx # Feedback sutil al enviar pedido a cocina
│   └── dashboard/                # Métricas, distribución por método y libro de ventas
├── pages/
│   ├── TableMapPage.jsx          # Pantalla 1: Mapa de Mesas compacto por Sectores con "+ Crear Mesa"
│   ├── OrderTerminalPage.jsx     # Pantalla 2: Terminal de Pedidos (65/35 split fijo)
│   ├── DashboardPage.jsx         # Pantalla 3: Métricas administrativas y auditoría
│   └── CashierPage.jsx           # Pantalla 4: Arqueo de Caja y Cierre de Turno Z
├── App.jsx                       # Router de vistas y orquestador de modales
└── index.css                     # Sistema de diseño sobrio en Zinc Dark
```
