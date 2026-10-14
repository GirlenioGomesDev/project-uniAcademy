export default function IllustrativeMap() {
  return (
    <figure className="location-map">
      <svg
        viewBox="0 0 800 500"
        role="img"
        aria-labelledby="recife-map-title recife-map-description"
      >
        <title id="recife-map-title">Mapa ilustrativo de Boa Viagem, Recife</title>
        <desc id="recife-map-description">
          Representação esquemática da região, com ruas, área verde e orla. Não representa uma rota
          nem uma unidade real.
        </desc>
        <rect width="800" height="500" fill="#eee7f3" />
        <path d="M665 0 Q630 180 670 310 T650 500 H800 V0Z" fill="#c7dfec" />
        <path d="M645 0 Q610 180 650 310 T630 500" fill="none" stroke="#ebd9ba" strokeWidth="24" />
        <rect x="56" y="46" width="140" height="93" rx="22" fill="#d2dfc5" />
        <rect x="380" y="334" width="123" height="113" rx="20" fill="#d2dfc5" />
        <g stroke="white" strokeWidth="19">
          <path d="M-20 170 L620 90" />
          <path d="M-20 330 L650 250" />
          <path d="M-20 465 L670 385" />
          <path d="M235 -20 L295 530" />
          <path d="M430 -20 L490 530" />
        </g>
        <g fill="#6a5a78" fontFamily="Arial, sans-serif" fontSize="15">
          <text x="280" y="119" transform="rotate(-7 280 119)">
            Av. Conselheiro Aguiar
          </text>
          <text x="67" y="315" transform="rotate(-7 67 315)">
            Boa Viagem
          </text>
          <text x="704" y="268" transform="rotate(90 704 268)">
            Oceano Atlântico
          </text>
          <text x="72" y="98" fontSize="13">
            Área verde
          </text>
        </g>
        <g transform="translate(358 226)">
          <circle r="42" fill="#7726ae" opacity=".12" />
          <path
            d="M0 25 C-11 9 -22 -2 -22 -14 A22 22 0 1 1 22 -14 C22 -2 11 9 0 25Z"
            fill="#7726ae"
            stroke="white"
            strokeWidth="3"
          />
          <circle cy="-14" r="7" fill="white" />
        </g>
        <rect x="255" y="277" width="220" height="46" rx="12" fill="#17151b" />
        <text
          x="365"
          y="306"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fontWeight="700"
          fill="white"
        >
          UniAcademy
        </text>
      </svg>
      <figcaption>Mapa ilustrativo • localização demonstrativa, sem rota real</figcaption>
    </figure>
  );
}
