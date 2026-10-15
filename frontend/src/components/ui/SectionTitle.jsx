export default function SectionTitle({ number, label, title, text }) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">
          {number} / {label}
        </span>
        <h2>{title}</h2>
      </div>
      {text && <p className="muted">{text}</p>}
    </div>
  );
}
