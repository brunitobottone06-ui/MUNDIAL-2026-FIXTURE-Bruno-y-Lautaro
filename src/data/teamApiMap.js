/**
 * Mapeo FIFA-code → API-Football team ID
 * IDs obtenidos de:
 *   - Qatar 2022 (/teams?league=1&season=2022)
 *   - Búsquedas individuales (/teams?code=XXX) para los nuevos clasificados de 2026
 *
 * Logo URL: https://media.api-sports.io/football/teams/{id}.png
 */
export const TEAM_API_MAP = {
  /* ── Grupo A ── */
  MEX: { id: 16,   name: 'México'            },
  RSA: { id: 1531, name: 'South Africa'      },
  KOR: { id: 17,   name: 'South Korea'       },
  CZE: { id: 770,  name: 'Czech Republic'    },

  /* ── Grupo B ── */
  CAN: { id: 5529, name: 'Canada'            },
  BIH: { id: 1113, name: 'Bosnia & Herz.'    },
  QAT: { id: 1569, name: 'Qatar'             },
  SUI: { id: 15,   name: 'Switzerland'       },

  /* ── Grupo C ── */
  BRA: { id: 6,    name: 'Brazil'            },
  MAR: { id: 31,   name: 'Morocco'           },
  HAI: { id: 2386, name: 'Haiti'             },
  SCO: { id: 1108, name: 'Scotland'          },

  /* ── Grupo D ── */
  USA: { id: 2384, name: 'USA'               },
  PAR: { id: 2380, name: 'Paraguay'          },
  AUS: { id: 20,   name: 'Australia'         },
  TUR: { id: 777,  name: 'Turkey'            },

  /* ── Grupo E ── */
  GER: { id: 25,   name: 'Germany'           },
  CUW: { id: 5530, name: 'Curaçao'           },
  CIV: { id: 1501, name: 'Ivory Coast'       },
  ECU: { id: 2382, name: 'Ecuador'           },

  /* ── Grupo F ── */
  NED: { id: 1118, name: 'Netherlands'       },
  JPN: { id: 12,   name: 'Japan'             },
  SWE: { id: 5,    name: 'Sweden'            },
  TUN: { id: 28,   name: 'Tunisia'           },

  /* ── Grupo G ── */
  BEL: { id: 1,    name: 'Belgium'           },
  EGY: { id: 32,   name: 'Egypt'             },
  IRN: { id: 22,   name: 'Iran'              },
  NZL: { id: 4673, name: 'New Zealand'       },

  /* ── Grupo H ── */
  ESP: { id: 9,    name: 'Spain'             },
  CPV: { id: 1533, name: 'Cape Verde'        },
  KSA: { id: 23,   name: 'Saudi Arabia'      },
  URU: { id: 7,    name: 'Uruguay'           },

  /* ── Grupo I ── */
  FRA: { id: 2,    name: 'France'            },
  SEN: { id: 13,   name: 'Senegal'           },
  IRQ: { id: 1567, name: 'Iraq'              },
  NOR: { id: 1090, name: 'Norway'            },

  /* ── Grupo J ── */
  ARG: { id: 26,   name: 'Argentina'         },
  ALG: { id: 1532, name: 'Algeria'           },
  AUT: { id: 775,  name: 'Austria'           },
  JOR: { id: 1548, name: 'Jordan'            },

  /* ── Grupo K ── */
  POR: { id: 27,   name: 'Portugal'          },
  COD: { id: 1508, name: 'Congo DR'          },
  UZB: { id: 1568, name: 'Uzbekistan'        },
  COL: { id: 8,    name: 'Colombia'          },

  /* ── Grupo L ── */
  ENG: { id: 10,   name: 'England'           },
  CRO: { id: 3,    name: 'Croatia'           },
  GHA: { id: 1504, name: 'Ghana'             },
  PAN: { id: 11,   name: 'Panama'            },
}

const CDN = 'https://media.api-sports.io/football/teams'

/** Retorna la URL del logo oficial de la API para un código FIFA */
export function getTeamLogo(fifaCode) {
  const entry = TEAM_API_MAP[fifaCode]
  return entry ? `${CDN}/${entry.id}.png` : null
}

/** Retorna el ID de API-Football para un código FIFA */
export function getTeamApiId(fifaCode) {
  return TEAM_API_MAP[fifaCode]?.id ?? null
}
