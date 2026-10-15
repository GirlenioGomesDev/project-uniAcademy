import { useMemo, useState } from 'react';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import ScheduleTable from '../components/ScheduleTable';
import { OPENING_PERIODS, WEEK_DAYS, getWeekday } from '../../../config/academy';
import { buildSchedule } from '../services/schedule';

export default function ScheduleSection({ schedules, error, onTrial }) {
  const [expanded, setExpanded] = useState(false);
  const [day, setDay] = useState(() => String(getWeekday()));
  const rows = useMemo(() => buildSchedule(schedules || []), [schedules]);
  const displayed = day ? rows.filter((entry) => entry.weekday === Number(day)) : rows;
  const currentDay = WEEK_DAYS.find((entry) => String(entry.value) === day);
  const needsConfirmation = rows.some((entry) => !entry.withinHours);

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
            {OPENING_PERIODS.map((period) => (
              <p key={period.label}>
                {period.label}
                <strong>{period.hours}</strong>
              </p>
            ))}
          </div>
          <small>
            Todos os planos permitem acesso durante todo o funcionamento. As aulas coletivas seguem
            os horários abaixo e os benefícios de cada plano.
          </small>
        </div>
        <div className="schedule-panel">
          <div className="schedule-day-heading">
            <h3>{currentDay?.label || 'Semana completa'}</h3>
            <Clock3 className="accent" size={28} />
          </div>
          <div className="day-tabs" aria-label="Escolher dia da semana">
            {WEEK_DAYS.map((entry) => (
              <button
                key={entry.value}
                className={day === String(entry.value) ? 'active' : ''}
                aria-pressed={day === String(entry.value)}
                onClick={() => setDay(String(entry.value))}
              >
                {entry.short}
              </button>
            ))}
            <button
              className={`week-tab ${day === '' ? 'active' : ''}`}
              aria-pressed={day === ''}
              onClick={() => setDay('')}
            >
              Semana completa
            </button>
          </div>
          {!schedules ? (
            <p role="status">
              {error
                ? 'Não foi possível consultar a grade. Atualize o catálogo para tentar novamente.'
                : 'Carregando horários…'}
            </p>
          ) : (
            <div className="schedule-cards">
              {displayed.map((entry) => {
                const Tag = entry.withinHours ? 'button' : 'article';
                return (
                  <Tag
                    key={entry.id}
                    className={`schedule-card ${entry.withinHours ? '' : 'schedule-invalid'}`}
                    {...(entry.withinHours
                      ? {
                          type: 'button',
                          onClick: () => onTrial(entry.modality_name),
                          'aria-label': `Solicitar aula de ${entry.displayName} ${entry.timeLabel}`,
                        }
                      : {})}
                  >
                    <span className="schedule-time-block">
                      <strong>
                        {entry.kind === 'gym'
                          ? entry.timeLabel.replaceAll(':00', 'h')
                          : entry.timeLabel}
                      </strong>
                      {!day && (
                        <small>
                          {WEEK_DAYS.find((value) => value.value === entry.weekday)?.short ||
                            'A confirmar'}
                        </small>
                      )}
                    </span>
                    <span className="schedule-class-info">
                      <b>{entry.displayName}</b>
                      <small>
                        {entry.kind === 'gym'
                          ? 'Acesso ao salão • orientação da equipe'
                          : `${entry.instructor} • ${entry.room}`}
                      </small>
                      {!entry.withinHours && (
                        <small className="schedule-warning">
                          Fora do expediente informado • confirme com a equipe
                        </small>
                      )}
                    </span>
                    {entry.withinHours && <ArrowUpRight aria-hidden="true" />}
                  </Tag>
                );
              })}
              {!displayed.length && (
                <p className="schedule-empty" role="status">
                  {day === '7'
                    ? 'Domingo é dia de descanso. Voltamos na segunda!'
                    : 'Nenhuma atividade publicada para este dia.'}
                </p>
              )}
            </div>
          )}
          <button
            className="button primary schedule-toggle"
            disabled={!schedules}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="full-schedule"
          >
            {expanded ? 'Recolher grade completa' : 'Ver grade completa e filtros'}{' '}
            <ArrowUpRight size={20} />
          </button>
          <div id="full-schedule" hidden={!expanded}>
            {expanded && schedules && <ScheduleTable rows={rows} day={day} onDayChange={setDay} />}
          </div>
          <small className="schedule-disclaimer">
            Horários semanais de Recife. Domingos e feriados sem funcionamento.{' '}
            {needsConfirmation
              ? 'Existem horários fora do expediente aguardando confirmação.'
              : 'Consulte a equipe sobre vagas e alterações nas turmas.'}
          </small>
        </div>
      </div>
    </section>
  );
}
