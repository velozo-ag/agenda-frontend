import React, { useState, useEffect } from 'react';
import { Save, Loader2, Calendar, Bell, CreditCard, Users, Clock, ShieldCheck } from 'lucide-react';
import { useMyTenant } from '../../hooks/useTenantBranding';
import { useUpdateBookingSettings } from '../../hooks/useTenantBranding';
import { Switch } from '../ui/Switch';

export function TenantBookingSettingsView({ section }) {
  const { data: tenant, isLoading } = useMyTenant();
  const updateSettings = useUpdateBookingSettings();
  
  const [formData, setFormData] = useState({
    slotDurationMinutes: 30,
    maxReschedulesPerAppt: 2,
    autoCancelPendingHours: 24,
    noShowAlertThreshold: 2,
    depositCbu: '',
    depositAlias: '',
    requireDepositOverride: true,
    hasCommissions: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      setFormData({
        slotDurationMinutes: tenant.slotDurationMinutes || 30,
        maxReschedulesPerAppt: tenant.maxReschedulesPerAppt || 2,
        autoCancelPendingHours: tenant.autoCancelPendingHours || 24,
        noShowAlertThreshold: tenant.noshowAlertThreshold || 2,
        depositCbu: tenant.depositCbu || '',
        depositAlias: tenant.depositAlias || '',
        requireDepositOverride: tenant.requiresConfirmation !== false,
        hasCommissions: tenant.hasCommissions || false,
      });
    }
  }, [tenant]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    updateSettings.mutate(formData, {
      onSuccess: () => {
        setHasChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
      <div className="p-5 border-b border-zinc-800/60 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            {section === 'agenda' && <><Calendar className="w-4 h-4 text-indigo-400"/> Configuración de Turnos</>}
            {section === 'notifications' && <><Bell className="w-4 h-4 text-indigo-400"/> Alertas & No-shows</>}
            {section === 'payments' && <><CreditCard className="w-4 h-4 text-indigo-400"/> Pagos & Señas</>}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {section === 'agenda' && 'Duración de turnos, cancelaciones y reprogramaciones.'}
            {section === 'notifications' && 'Alertas de inasistencia (no-show).'}
            {section === 'payments' && 'Datos bancarios para las señas de reservas.'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || updateSettings.isPending}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            hasChanges
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : saveSuccess
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {saveSuccess ? 'Guardado ✓' : 'Guardar'}
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-8 flex-1">
        {section === 'agenda' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Duración de Slots (Minutos)
                </label>
                <input
                  type="number"
                  value={formData.slotDurationMinutes}
                  onChange={(e) => handleChange('slotDurationMinutes', parseInt(e.target.value) || 30)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-zinc-500 mt-1">Duración base en el calendario.</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Límite Reprogramaciones / Turno
                </label>
                <input
                  type="number"
                  value={formData.maxReschedulesPerAppt}
                  onChange={(e) => handleChange('maxReschedulesPerAppt', parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-xs text-zinc-500 mt-1">Cuántas veces un cliente puede cambiar su turno.</p>
              </div>
              
              <div className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Auto-cancelar Reservas Pendientes</span>
                      {Number(formData.autoCancelPendingHours) > 0 ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          Activo: {formData.autoCancelPendingHours}hs
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Desactivado
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Cancela y libera el horario automáticamente si el cliente no sube comprobante o no se confirma a tiempo.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const isCurrentlyActive = Number(formData.autoCancelPendingHours) > 0;
                      handleChange('autoCancelPendingHours', isCurrentlyActive ? 0 : 24);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      Number(formData.autoCancelPendingHours) > 0 ? 'bg-amber-500' : 'bg-zinc-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        Number(formData.autoCancelPendingHours) > 0 ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {Number(formData.autoCancelPendingHours) > 0 && (
                  <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                    <span className="text-xs font-medium text-zinc-300">
                      Tiempo de tolerancia antes de cancelar:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[1, 2, 4, 12, 24, 48].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleChange('autoCancelPendingHours', h)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                            formData.autoCancelPendingHours === h
                              ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                      <div className="flex items-center gap-1 ml-1">
                        <input
                          type="number"
                          min="1"
                          max="168"
                          value={formData.autoCancelPendingHours}
                          onChange={(e) => handleChange('autoCancelPendingHours', parseInt(e.target.value) || 1)}
                          className="w-14 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-amber-500"
                        />
                        <span className="text-xs text-zinc-500 font-mono">hs</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {section === 'notifications' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Alerta de No-Shows (Inasistencias)
              </label>
              <input
                type="number"
                value={formData.noShowAlertThreshold}
                onChange={(e) => handleChange('noShowAlertThreshold', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 max-w-sm"
              />
              <p className="text-xs text-zinc-500 mt-1">Muestra alerta al barbero a partir de esta cantidad de inasistencias del cliente.</p>
            </div>
          </div>
        )}

        {section === 'payments' && (
          <div className="space-y-6">
            {tenant?.hasDeposit === false && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Módulo de Señas no incluido en Plan Cero</div>
                  <p className="mt-1 text-zinc-300 leading-relaxed">
                    Tu plan actual (Plan Cero) no incluye la solicitud de seña bancaria por transferencia ni la captura de comprobantes. Para habilitar esta función en tus turnos, pasate al <strong>Plan Navaja ($14.900/mes)</strong> o <strong>Plan Crew ($24.900/mes)</strong>.
                  </p>
                </div>
              </div>
            )}
            <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/50 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Requerir Seña Obligatoria</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Si se activa, el cliente deberá subir el comprobante de pago.</p>
                </div>
                <Switch 
                  checked={formData.requireDepositOverride} 
                  onChange={(val) => handleChange('requireDepositOverride', val)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  CBU / CVU para Señas
                </label>
                <input
                  type="text"
                  value={formData.depositCbu}
                  onChange={(e) => handleChange('depositCbu', e.target.value)}
                  placeholder="Ej: 00000031000..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Alias Bancario
                </label>
                <input
                  type="text"
                  value={formData.depositAlias}
                  onChange={(e) => handleChange('depositAlias', e.target.value)}
                  placeholder="Ej: ROOSTY.BARBERIA"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
