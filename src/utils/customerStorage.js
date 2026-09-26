/**
 * Storage utility for client-side web menu (QR & Online orders).
 * 
 * Separates:
 * 1. `roosty_customer_profile`: Permanent customer details (name, phone, delivery address).
 * 2. `roosty_active_orders`: Transient order tokens with a 4-hour time-to-live (TTL).
 */

const PROFILE_KEY = 'roosty_customer_profile';
const ACTIVE_ORDERS_KEY = 'roosty_active_orders';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export const customerStorage = {
  // ── 1. Customer Profile (Permanent) ──
  getProfile: () => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
      // Backwards compatibility with previous keys
      const legacyName = localStorage.getItem('pos_customer_name') || '';
      const legacyPhone = localStorage.getItem('pos_customer_phone') || '';
      const legacyAddress = localStorage.getItem('pos_customer_address') || '';
      if (legacyName || legacyPhone || legacyAddress) {
        return { name: legacyName, phone: legacyPhone, address: legacyAddress };
      }
    } catch (e) {
      console.warn('Error reading customer profile from localStorage', e);
    }
    return { name: '', phone: '', address: '' };
  },

  saveProfile: ({ name, phone, address }) => {
    try {
      const current = customerStorage.getProfile();
      const updated = {
        name: name !== undefined ? name.trim() : current.name,
        phone: phone !== undefined ? phone.trim() : current.phone,
        address: address !== undefined ? address.trim() : current.address,
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      // Keep legacy keys synced just in case
      if (updated.name) localStorage.setItem('pos_customer_name', updated.name);
      if (updated.phone) localStorage.setItem('pos_customer_phone', updated.phone);
      if (updated.address) localStorage.setItem('pos_customer_address', updated.address);
    } catch (e) {
      console.warn('Error saving customer profile to localStorage', e);
    }
  },

  // ── 2. Active Orders Tracking (4-Hour Expiration) ──
  getActiveOrders: () => {
    try {
      const raw = localStorage.getItem(ACTIVE_ORDERS_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return [];

      const now = Date.now();
      // Purge orders older than 4 hours
      const validOrders = list.filter((order) => {
        const expiresAt = order.expiresAt || (order.createdAt ? order.createdAt + FOUR_HOURS_MS : 0);
        return expiresAt > now;
      });

      if (validOrders.length !== list.length) {
        localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify(validOrders));
      }

      return validOrders;
    } catch (e) {
      console.warn('Error reading active orders from localStorage', e);
      return [];
    }
  },

  saveOrder: ({ orderToken, orderId, storeName, slug, total, orderType }) => {
    if (!orderToken) return;
    try {
      const current = customerStorage.getActiveOrders();
      const now = Date.now();
      const newEntry = {
        orderToken,
        orderId,
        storeName: storeName || 'Pedido en curso',
        slug: slug || '',
        total: total || 0,
        orderType: orderType || 'DELIVERY',
        createdAt: now,
        expiresAt: now + FOUR_HOURS_MS,
      };

      // Filter out existing entry with same token if present
      const updated = [newEntry, ...current.filter((o) => o.orderToken !== orderToken)];
      localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('roosty_orders_changed', { detail: newEntry }));
    } catch (e) {
      console.warn('Error saving active order to localStorage', e);
    }
  },

  markOrderCompleted: (orderToken) => {
    if (!orderToken) return;
    try {
      const current = customerStorage.getActiveOrders();
      const now = Date.now();
      const TEN_MINUTES_MS = 10 * 60 * 1000;
      let changed = false;
      const updated = current.map((o) => {
        if (o.orderToken === orderToken) {
          const completedExpiresAt = now + TEN_MINUTES_MS;
          // If expiresAt is not already set to expire soon, set to 10 minutes
          if (!o.completedAt || o.expiresAt > completedExpiresAt) {
            changed = true;
            return {
              ...o,
              completedAt: o.completedAt || now,
              expiresAt: completedExpiresAt,
            };
          }
        }
        return o;
      });

      if (changed) {
        localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('roosty_orders_changed'));
      }
    } catch (e) {
      console.warn('Error marking order as completed in localStorage', e);
    }
  },

  removeOrder: (orderToken) => {
    try {
      const current = customerStorage.getActiveOrders();
      const updated = current.filter((o) => o.orderToken !== orderToken);
      localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('roosty_orders_changed'));
    } catch (e) {
      console.warn('Error removing active order from localStorage', e);
    }
  },
};

export default customerStorage;
