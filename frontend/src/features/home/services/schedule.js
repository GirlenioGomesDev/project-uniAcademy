import { WEEK_DAYS } from '../../../config/academy.js';

const normalize = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
const names = {
  musculacao: ['musculacao', 'Musculação'],
  funcional: ['funcional', 'Treinamento funcional'],
  'treinamento funcional': ['funcional', 'Treinamento funcional'],
  danca: ['danca', 'Dança e ritmos'],
  'danca e ritmos': ['danca', 'Dança e ritmos'],
  lutas: ['lutas', 'Lutas'],
};
export const getModalityKey = (value) => names[normalize(value)]?.[0] || normalize(value);
export const getModalityLabel = (value) => names[normalize(value)]?.[1] || value;
const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export function buildSchedule(schedules = []) {
  const classes = schedules.map((entry) => {
    const weekday = Number(entry.weekday);
    const opening = WEEK_DAYS.find((day) => day.value === weekday);
    const times = String(entry.time_slot || '').match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g) || [];
    const start = times[0] ? toMinutes(times[0]) : null;
    const end = times[1] ? toMinutes(times[1]) : null;
    const withinHours = Boolean(
      opening?.opens &&
      start !== null &&
      start >= toMinutes(opening.opens) &&
      start < toMinutes(opening.closes) &&
      (end === null || (end > start && end <= toMinutes(opening.closes))),
    );
    return {
      ...entry,
      id: `class-${entry.id}`,
      weekday,
      kind: 'class',
      modalityKey: getModalityKey(entry.modality_name),
      displayName: getModalityLabel(entry.modality_name),
      timeLabel: times.length
        ? times.map((time) => time.padStart(5, '0')).join('–')
        : 'A confirmar',
      start: start ?? Infinity,
      withinHours,
    };
  });
  const gym = WEEK_DAYS.filter((day) => day.opens).map((day) => ({
    id: `gym-${day.value}`,
    weekday: day.value,
    kind: 'gym',
    modality_name: 'Musculação',
    modalityKey: 'musculacao',
    displayName: 'Musculação',
    timeLabel: `${day.opens}–${day.closes}`,
    instructor: 'Equipe UniAcademy',
    room: 'Salão de musculação',
    start: toMinutes(day.opens),
    withinHours: true,
  }));
  return [...gym, ...classes].sort(
    (a, b) =>
      a.weekday - b.weekday ||
      a.start - b.start ||
      a.displayName.localeCompare(b.displayName, 'pt-BR'),
  );
}

export function getScheduleSummary(name, schedules = []) {
  if (getModalityKey(name) === 'musculacao') return 'Seg–sex • 06h–23h | Sáb • 08h–14h';
  const rows = buildSchedule(schedules).filter(
    (row) => row.kind === 'class' && row.modalityKey === getModalityKey(name) && row.withinHours,
  );
  if (!rows.length) return 'Turmas e horários a confirmar com a equipe.';
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.timeLabel)) groups.set(row.timeLabel, new Set());
    groups.get(row.timeLabel).add(row.weekday);
  }
  return [...groups]
    .map(
      ([time, days]) =>
        `${[...days]
          .sort((a, b) => a - b)
          .map((value) => WEEK_DAYS[value - 1].short)
          .join(', ')} • ${time}`,
    )
    .join(' | ');
}
