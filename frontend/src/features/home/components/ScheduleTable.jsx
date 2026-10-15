import { useState } from 'react';
import { WEEK_DAYS } from '../../../config/academy';

export default function ScheduleTable({ rows, day, onDayChange }) {
  const [modality, setModality] = useState('');
  const visible = rows.filter(
    (entry) =>
      (!day || String(entry.weekday) === day) && (!modality || entry.modalityKey === modality),
  );
  const options = [...new Map(rows.map((entry) => [entry.modalityKey, entry.displayName]))];
  return (
    <>
      <p className="schedule-table-caption">
        A mesma programação dos cartões, com funcionamento do salão e aulas coletivas. Os filtros de
        dia são sincronizados.
      </p>
      <div className="filters">
        <label>
          Dia
          <select
            aria-label="Dia da grade"
            value={day}
            onChange={(event) => onDayChange(event.target.value)}
          >
            <option value="">Todos os dias</option>
            {WEEK_DAYS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Modalidade
          <select
            aria-label="Modalidade da grade"
            value={modality}
            onChange={(event) => setModality(event.target.value)}
          >
            <option value="">Todas</option>
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">
            Funcionamento da academia e grade de aulas da UniAcademy
          </caption>
          <thead>
            <tr>
              <th>Dia / horário</th>
              <th>Atividade</th>
              <th>Orientação / sala</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => (
              <tr key={entry.id} className={entry.kind === 'gym' ? 'gym-row' : ''}>
                <td>
                  {WEEK_DAYS.find((value) => value.value === entry.weekday)?.label || 'A confirmar'}
                  <strong className="accent">{entry.timeLabel}</strong>
                </td>
                <td>
                  <span className="schedule-table-label">{entry.displayName}</span>
                  {entry.kind === 'gym' && <small>Durante o funcionamento</small>}
                  {!entry.withinHours && (
                    <small className="table-schedule-warning">Fora do expediente • confirmar</small>
                  )}
                </td>
                <td>
                  {entry.instructor}
                  <small>{entry.room}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <p role="status">Nenhuma aula com estes filtros.</p>}
      </div>
    </>
  );
}
