import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScheduleTable from '../components/ScheduleTable';

export default function ScheduleSection({ schedules, error, onTrial }) {
  const [expanded, setExpanded] = useState(false);
  const classes = schedules?.filter((entry) => entry.weekday === 2) || [];
  return (
    <section id="horarios" className="dark section">
      <div className="container schedule-layout">
        <div>
          <span className="eyebrow">05 / CABE NA SUA ROTINA</span>
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
        <div>
          <div className="schedule-day-heading">
            <h3>Na terça-feira</h3>
            <span className="day-badge">TER</span>
          </div>
          {!schedules ? (
            <p role="status">
              {error ? 'Horários indisponíveis no momento.' : 'Carregando horários…'}
            </p>
          ) : (
            <div className="schedule-cards">
              <button className="schedule-card" onClick={onTrial}>
                <strong>07:00</strong>
                <span>
                  <b>Musculação</b>
                  <small>Orientação da equipe • Durante todo o funcionamento</small>
                </span>
                <ArrowUpRight />
              </button>
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
          {expanded && (
            <div id="full-schedule">
              {schedules ? (
                <ScheduleTable schedules={schedules} />
              ) : (
                <p role="status">Aguarde o carregamento do catálogo.</p>
              )}
            </div>
          )}
          <small className="schedule-disclaimer">
            Horários demonstrativos, sujeitos a ajustes. Consulte a equipe sobre a disponibilidade
            das turmas.
          </small>
        </div>
      </div>
    </section>
  );
}
