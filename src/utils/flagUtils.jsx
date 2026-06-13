/* Mapa FIFA code → ISO2 para https://flagcdn.com */
export const FIFA_TO_ISO2 = {
  ARG:'ar', BRA:'br', FRA:'fr', GER:'de', ESP:'es', POR:'pt',
  NED:'nl', BEL:'be', ENG:'gb-eng', CRO:'hr', MAR:'ma', SEN:'sn',
  JPN:'jp', KOR:'kr', USA:'us',  MEX:'mx', CAN:'ca', AUS:'au',
  SUI:'ch', ECU:'ec', URU:'uy',  COL:'co', GHA:'gh', TUN:'tn',
  IRN:'ir', QAT:'qa', KSA:'sa',  CZE:'cz', AUT:'at', SWE:'se',
  NOR:'no', TUR:'tr', EGY:'eg',  CIV:'ci', RSA:'za', ALG:'dz',
  COD:'cd', NZL:'nz', CPV:'cv',  JOR:'jo', IRQ:'iq', UZB:'uz',
  CUW:'cw', HAI:'ht', PAR:'py',  PAN:'pa', BIH:'ba', SCO:'gb-sct',
  CRC:'cr',
}

/**
 * Componente de bandera.
 * @param {string} code  - Código FIFA (ej. "ARG")
 * @param {string} alt   - Texto alternativo
 * @param {number} size  - Ancho en px (default 28)
 * @param {string} className - Clases extra
 */
export function FlagImg({ code, alt = '', size = 28, className = '' }) {
  const iso = FIFA_TO_ISO2[code]
  if (!iso) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.png`}
      alt={alt}
      className={`shrink-0 rounded-sm shadow-sm ${className}`}
      style={{ width: size, height: Math.round(size * 0.67), objectFit: 'cover' }}
      onError={e => { e.currentTarget.style.display = 'none' }}
    />
  )
}
