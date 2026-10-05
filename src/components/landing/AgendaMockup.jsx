import { Lock, Wallet, CalendarCheck, Bell } from 'lucide-react';

// Clases completas (JIT-safe) por barbero
const TONES = {
  indigo: {
    card: 'bg-indigo-500/15 border-indigo-400/25',
    bar: 'bg-indigo-400',
    dot: 'bg-indigo-400',
  },
  emerald: {
    card: 'bg-emerald-500/15 border-emerald-400/25',
    bar: 'bg-emerald-400',
    dot: 'bg-emerald-400',
  },
  violet: {
    card: 'bg-violet-500/15 border-violet-400/25',
    bar: 'bg-violet-400',
    dot: 'bg-violet-400',
  },
};

const BARBERS = [
  { name: 'Tomás', tone: 'indigo' },
  { name: 'Lucho', tone: 'emerald' },
  { name: 'Nico', tone: 'violet' },
];

const START_HOUR = 10;
const ROW_H = 52; // px por hora
const HOURS = [10, 11, 12, 13, 14, 15, 16];

// col, inicio (hora decimal), duracion (h), cliente, servicio, hora texto, seña pagada
const APPOINTMENTS = [
  { col: 0, start: 10, dur: 0.75, client: 'Martín R.', service: 'Corte Fade', time: '10:00', paid: true },
  { col: 0, start: 11, dur: 1, client: 'Joaquín P.', service: 'Corte + Barba', time: '11:00', paid: true },
  { col: 0, start: 13, dur: 0.75, client: 'Fede L.', service: 'Perfilado', time: '13:00', paid: false },
  { col: 0, start: 14.5, dur: 1, client: 'Ramiro S.', service: 'Corte Clásico', time: '14:30', paid: true },
  { col: 1, start: 10.5, dur: 1, client: 'Santi G.', service: 'Corte Clásico', time: '10:30', paid: true },
  { col: 1, start: 12, dur: 1.25, client: 'Bruno A.', service: 'Color + Corte', time: '12:00', paid: true },
  { col: 1, start: 14, dur: 1, client: 'Dani M.', service: 'Corte + Barba', time: '14:00', paid: false },
  { col: 2, start: 10, dur: 0.5, client: 'Leo V.', service: 'Barba', time: '10:00', paid: false },
  { col: 2, start: 11, dur: 0.75, client: 'Axel T.', service: 'Corte Fade', time: '11:00', paid: true },
  { col: 2, start: 12.5, dur: 1, client: 'Gonza F.', service: 'Barba Premium', time: '12:30', paid: true },
  { col: 2, start: 15, dur: 1, client: 'Ian C.', service: 'Corte + Barba', time: '15:00', paid: true },
];

const NOW_OFFSET = (13.33 - START_HOUR) * ROW_H;

export function AgendaMockup() {
  return (
    <div className="relative w-full">
      {/* Glow */}
      <div className="absolute -inset-6 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative lp-bezel-dark rounded-2xl sm:rounded-3xl p-1.5 sm:p-2">
        <div className="rounded-xl sm:rounded-[1.25rem] bg-[#0b0b0e] border border-zinc-800 overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#101014] border-b border-zinc-800/80">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] lp-mono text-zinc-400">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-zinc-200 font-semibold">elbaron</span>
                <span>.agenda.roosty.site</span>
              </div>
            </div>
            <div className="w-10" />
          </div>

          {/* App header */}
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-zinc-800/70">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white leading-tight truncate">Sábado 14 de junio</div>
              <div className="text-[9px] lp-mono text-zinc-500 mt-0.5">11 turnos · 3 profesionales</div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-1 rounded-md bg-zinc-800 text-[9px] font-semibold text-white border border-zinc-700">Día</span>
              <span className="px-2 py-1 rounded-md text-[9px] font-semibold text-zinc-500">Semana</span>
              <span className="hidden sm:inline-flex px-2 py-1 rounded-md bg-indigo-500 text-[9px] font-bold text-white">+ Turno</span>
            </div>
          </div>

          {/* Barber headers */}
          <div className="grid grid-cols-[34px_repeat(3,minmax(0,1fr))] border-b border-zinc-800/70">
            <div />
            {BARBERS.map((b) => (
              <div key={b.name} className="flex items-center justify-center gap-1.5 py-2 border-l border-zinc-800/60">
                <span className={`w-1.5 h-1.5 rounded-full ${TONES[b.tone].dot}`} />
                <span className="text-[10px] font-semibold text-zinc-200">{b.name}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-[34px_repeat(3,minmax(0,1fr))] relative">
            {/* Hours */}
            <div className="relative">
              {HOURS.map((h) => (
                <div
                  key={h}
                  style={{ height: ROW_H }}
                  className="text-[8px] lp-mono text-zinc-600 text-right pr-1.5 pt-0.5"
                >
                  {h}:00
                </div>
              ))}
            </div>

            {BARBERS.map((b, colIdx) => (
              <div key={b.name} className="relative border-l border-zinc-800/60">
                {/* Hour lines */}
                {HOURS.map((h) => (
                  <div key={h} style={{ height: ROW_H }} className="border-b border-zinc-900" />
                ))}

                {APPOINTMENTS.filter((a) => a.col === colIdx).map((a) => (
                  <div
                    key={`${a.col}-${a.start}`}
                    style={{
                      top: (a.start - START_HOUR) * ROW_H + 2,
                      height: a.dur * ROW_H - 4,
                    }}
                    className={`absolute inset-x-1 rounded-md border overflow-hidden pl-2 pr-1.5 py-1 ${TONES[b.tone].card}`}
                  >
                    <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${TONES[b.tone].bar}`} />
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <div className="text-[9px] font-bold text-white truncate leading-tight">{a.client}</div>
                        {a.dur >= 0.75 && (
                          <div className="text-[8px] text-zinc-400 truncate leading-tight mt-0.5">{a.service}</div>
                        )}
                      </div>
                      {a.paid && a.dur >= 0.75 && (
                        <span className="shrink-0 text-[7px] lp-mono font-bold text-emerald-300 bg-emerald-500/15 px-1 rounded">
                          SEÑA
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Now line */}
            <div
              style={{ top: NOW_OFFSET }}
              className="absolute left-[34px] right-0 border-t border-dashed border-indigo-400/70 pointer-events-none"
            >
              <span className="absolute -left-[34px] -top-2 text-[8px] lp-mono font-bold bg-indigo-500 text-white px-1 rounded">
                13:20
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification: reserva online */}
      <div className="lp-float-a hidden sm:flex absolute -left-6 lg:-left-10 bottom-14 items-center gap-2.5 p-2.5 pr-3.5 rounded-2xl bg-white border border-zinc-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <CalendarCheck className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-zinc-900 leading-tight">Nueva reserva online</div>
          <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">Corte + Barba · 17:30</div>
        </div>
      </div>

      {/* Floating notification: seña */}
      <div className="lp-float-b hidden sm:flex absolute -right-3 lg:-right-8 top-24 items-center gap-2.5 p-2.5 pr-3.5 rounded-2xl bg-white border border-zinc-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)]">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Wallet className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-zinc-900 leading-tight">Seña acreditada</div>
          <div className="text-[10px] text-zinc-500 leading-tight mt-0.5 lp-tabular">$3.000 · transferencia</div>
        </div>
      </div>

      <div className="lp-float-a hidden lg:flex absolute right-8 -bottom-5 items-center gap-2 px-3 py-2 rounded-full bg-zinc-900 border border-zinc-700 shadow-xl">
        <Bell className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[10px] font-semibold text-zinc-200">Recordatorio por WhatsApp enviado</span>
      </div>
    </div>
  );
}
