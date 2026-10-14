import { useState } from 'react';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import ScheduleTable from '../components/ScheduleTable';

const days = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];
const shortDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

export default function ScheduleSection({ schedules, error, onTrial }) {
  const [expanded, setExpanded] = useState(false);
  const [day, setDay] = useState(2);
  const classes = schedules?.filter((entry) => entry.weekday === day) || [];
  return (
    <section id="horarios" className="dark section">
      <div className="container schedule-layout">
        <div>
          <span className="eyebrow">CABE NA SUA ROTINA</span>
          <h2>
            O melhor
            <br />
            horário é o seu.
          </h2>
          <p className="muted">
            Treine antes do trabalho, no intervalo ou no fim do dia. A gente acompanha seu ritmo.
          </p>
          <div className="hours">
            <p>
              Segunda a sexta <strong>06h às 23h</strong>
            </p>
            <p>
              Sábado <strong>08h às 14h</strong>
            </p>
            <p>
              Domingos e feriados <strong>Fechado</strong>
            </p>
          </div>
          <small>Musculação livre durante todo o funcionamento. A equipe orienta no salão.</small>
        </div>
        <div className="schedule-panel">
          <div className="schedule-day-heading">
            <h3>{days[day - 1]}</h3>
            <Clock3 className="accent" size={28} />
          </div>
          <div className="day-tabs" aria-label="Escolher dia da semana">
            {shortDays.map((label, index) => (
              <button
                key={label}
                className={day === index + 1 ? 'active' : ''}
                aria-pressed={day === index + 1}
                onClick={() => setDay(index + 1)}
              >
                {label}
              </button>
            ))}
          </div>
          {!schedules ? (
            <p role="status">
              {error ? 'Não foi possível consultar a grade.' : 'Carregando horários…'}
            </p>
          ) : (
            <div className="schedule-cards">
              {day <= 6 && (
                <button className="schedule-card" onClick={onTrial}>
                  <strong>{day === 6 ? '08–14h' : '06–23h'}</strong>
                  <span>
                    <b>Musculação</b>
                    <small>Acesso livre • orientação da equipe</small>
                  </span>
                  <ArrowUpRight />
                </button>
              )}
              {classes.map((entry) => (
                <button key={entry.id} className="schedule-card" onClick={onTrial}>
                  <strong>{entry.time_slot}</strong>
                  <span>
                    <b>{entry.modality_name}</b>
                    <small>
                      {entry.instructor} • {entry.room}
                    </small>
                  </span>
                  <ArrowUpRight />
                </button>
              ))}
              {!classes.length && (
                <p className="schedule-empty" role="status">
                  {day === 7
                    ? 'Domingo é dia de descanso. Voltamos na segunda!'
                    : 'Sem aulas coletivas neste dia. Você pode treinar musculação.'}
                </p>
              )}
            </div>
          )}
          <button
            className="button primary schedule-toggle"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="full-schedule"
          >
            {expanded ? 'Recolher grade completa' : 'Ver grade completa e filtros'}{' '}
            <ArrowUpRight size={20} />
          </button>
          <div id="full-schedule" hidden={!expanded}>
            {expanded && schedules && <ScheduleTable schedules={schedules} />}
          </div>
          <small className="schedule-disclaimer">
            Grade demonstrativa. Solicite uma aula para consultar a disponibilidade.
          </small>
        </div>
      </div>
    </section>
  );
}
