import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  KeyRound, 
  Lock,
  Check
} from 'lucide-react';
import { userService } from '../services/userService';
import { UserFormModal } from '../components/admin/UserFormModal';
import { ChangePasswordModal } from '../components/admin/ChangePasswordModal';
import { Switch } from '../components/ui/Switch';

export function UsersAdminPage() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userForPassword, setUserForPassword] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Queries
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await userService.getAll();
      return res.data || res || [];
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: (userId) => userService.toggleActive(userId),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast(`Estado de ${updated?.fullName || 'usuario'} actualizado`);
    },
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const roleNorm = (u.role || '').toUpperCase().replace(/[-_]/g, '');
      const userNorm = (u.username || '').toLowerCase().trim();
      if (roleNorm === 'SUPERADMIN' || userNorm === 'superadmin') {
        return false;
      }
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (u.fullName && u.fullName.toLowerCase().includes(q)) || (u.username && u.username.toLowerCase().includes(q));
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const getRoleBadge = (role) => {
    const r = (role || '').toUpperCase().replace(/[-_]/g, '');
    switch (r) {
      case 'SUPERADMIN':
        return {
          label: 'Super Admin',
          classes: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        };
      case 'ADMIN':
        return {
          label: 'Administrador',
          classes: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
      
        return {
          label: 'Cajero',
          classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'KITCHEN':
        return {
          label: 'Cocina',
          classes: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        };
      case 'BARBER':
      default:
        return {
          label: 'Mozo',
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent text-zinc-900 dark:text-zinc-100 overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & New Button */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Personal & Staff de la Barbería</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            {users.length} miembros registrados con acceso al sistema
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setUserToEdit(null);
            setIsUserModalOpen(true);
          }}
          className="btn-touch px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Search & Role Filters */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o usuario..."
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700 font-sans"
          />
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
          {['ALL', 'ADMIN', 'BARBER'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                roleFilter === r
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {r === 'ALL' ? 'Todos' : r === 'ADMIN' ? 'Admins' : r === 'BARBER' ? 'Barberos' : 'Desconocido'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Stacked Table */}
      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-850/80 pr-1">
        {filteredUsers.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs space-y-2">
            <Users className="w-7 h-7 opacity-30" />
            <span>No se encontraron empleados con los filtros aplicados</span>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const roleInfo = getRoleBadge(u.role);
            const isActive = u.active;

            return (
              <div
                key={u.id}
                className={`py-3 px-2 flex items-center justify-between gap-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/40 rounded-lg ${
                  !isActive ? 'opacity-60 bg-zinc-100/50 dark:bg-zinc-950/40' : ''
                }`}
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center font-mono text-xs shrink-0 shadow-inner">
                    {u.username ? u.username.slice(0, 2).toUpperCase() : 'US'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {u.fullName}
                      </h3>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        @{u.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                        <span>{u.pin ? 'PIN configurado' : 'Sin PIN'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Role Badge */}
                <div className="shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${roleInfo.classes}`}>
                    {roleInfo.label}
                  </span>
                </div>

                {/* Right: Switch & Actions */}
                <div className="flex items-center gap-3 shrink-0 pl-2">
                  <Switch
                    checked={isActive}
                    onChange={() => toggleActiveMutation.mutate(u.id)}
                    label={isActive ? 'Activo' : 'Pausado'}
                    className="hidden sm:inline-flex"
                  />

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserForPassword(u);
                        setIsPasswordModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800 active:scale-95 shadow-xs"
                      title="Cambiar contraseña"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserToEdit(u);
                        setIsUserModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800 active:scale-95 shadow-xs"
                      title="Editar empleado"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userToEdit={userToEdit}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          showToast('Empleado guardado correctamente');
        }}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        user={userForPassword}
      />
    </div>
  );
}
