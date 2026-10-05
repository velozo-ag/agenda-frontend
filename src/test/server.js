import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/authHandlers';
import { tenantHandlers } from './handlers/tenantHandlers';
import { superAdminHandlers } from './handlers/superAdminHandlers';
import { demoHandlers } from './handlers/demoHandlers';

export const server = setupServer(
  ...authHandlers,
  ...tenantHandlers,
  ...superAdminHandlers,
  ...demoHandlers
);
