import { useState } from 'react';
const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function ScheduleTable({ schedules }) {
  const [day, setDay] = useState('');
  const [modality, setModality] = useState('');
  const rows = schedules.filter(
    (entry) =>
      (!day || String(entry.weekday) === day) && (!modality || entry.modality_name === modality),
  );
  return (
    <>
      <div className="filters">
        <label>
          Dia
          <select value={day} onChange={(event) => setDay(event.target.value)}>
            <option value="">Todos os dias</option>
            {days.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Modalidade
          <select value={modality} onChange={(event) => setModality(event.target.value)}>
            <option value="">Todas</option>
            {[...new Set(schedules.map((entry) => entry.modality_name))].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Grade de aulas da UniAcademy</caption>
          <thead>
            <tr>
              <th>Dia / horário</th>
              <th>Aula</th>
              <th>Professor / sala</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => (
              <tr key={entry.id}>
                <td>
                  {days[entry.weekday - 1]}
                  <strong className="accent">{entry.time_slot}</strong>
                </td>
                <td>{entry.modality_name}</td>
                <td>
                  {entry.instructor}
                  <small>{entry.room}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p role="status">Nenhuma aula com estes filtros.</p>}
      </div>
    </>
  );
}
