import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/authHandlers';
import { tableHandlers } from './handlers/tableHandlers';
import { paymentHandlers } from './handlers/paymentHandlers';
import { orderHandlers } from './handlers/orderHandlers';
import { shiftHandlers } from './handlers/shiftHandlers';
import { cashMovementHandlers } from './handlers/cashMovementHandlers';
import { productHandlers } from './handlers/productHandlers';
import { tenantHandlers } from './handlers/tenantHandlers';
import { kitchenHandlers } from './handlers/kitchenHandlers';
import { superAdminHandlers } from './handlers/superAdminHandlers';
import { demoHandlers } from './handlers/demoHandlers';

export const server = setupServer(
  ...authHandlers,
  ...tableHandlers,
  ...paymentHandlers,
  ...kitchenHandlers,
  ...orderHandlers,
  ...shiftHandlers,
  ...cashMovementHandlers,
  ...productHandlers,
  ...tenantHandlers,
  ...superAdminHandlers,
  ...demoHandlers
);
