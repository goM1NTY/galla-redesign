const LogoBackgroundFilter = () => (
<svg aria-hidden="true" width="0" height="0" className="absolute pointer-events-none">

  <filter id="match-header" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
    <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 -0.5 -0.5 0 0" result="redDifference" />
    <feComponentTransfer in="redDifference" result="redMask">
      <feFuncA type="table" tableValues="0 0 0 0 0 1 1 1 1 1 1" />
    </feComponentTransfer>
    <feFlood floodColor="#9e0102" result="headerRed" />
    <feComposite in="headerRed" in2="redMask" operator="in" result="matchedRed" />
    <feComposite in="SourceGraphic" in2="redMask" operator="out" result="logoDetails" />
    <feMerge>
      <feMergeNode in="logoDetails" />
      <feMergeNode in="matchedRed" />
    </feMerge>
  </filter>
</svg>

);
export default LogoBackgroundFilter;
