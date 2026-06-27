export const AREA_TONES = ['rose', 'amber', 'purple', 'teal', 'blue', 'emerald', 'indigo', 'orange', 'cyan', 'red', 'pink', 'violet'] as const;

export const AREA_TONE_MAP: Record<string, string> = {
  'Mujeres Género y Diversidad': 'rose',
  'Mujer': 'rose',
  'Niñez, Adolescencia y Familia': 'amber',
  'Niñez': 'amber',
  'Personas Mayores': 'purple',
  'Desarrollo Comunitario': 'teal',
  'Inclusión': 'blue',
  'Salud': 'emerald',
  'Salud Social y Comunitaria': 'emerald',
  'Trabajo y Producción': 'indigo',
  'Trabajo': 'indigo',
  'Deportes y Recreación': 'orange',
  'Deportes': 'orange',
  'Turismo': 'cyan',
  'Cultura': 'red',
  'Educación': 'pink',
};

export function getAreaTone(areaName: string, fallbackIndex: number): string {
  return AREA_TONE_MAP[areaName] || AREA_TONES[fallbackIndex % AREA_TONES.length];
}

export const AREA_ORDER = [
  'Mujeres Género y Diversidad',
  'Niñez, Adolescencia y Familia',
  'Niñez',
  'Personas Mayores',
  'Desarrollo Comunitario',
  'Inclusión',
  'Salud',
  'Salud Social y Comunitaria',
  'Trabajo y Producción',
  'Trabajo',
  'Deportes y Recreación',
  'Deportes',
  'Turismo',
  'Cultura',
  'Educación',
];

export function sortByAreaOrder<T extends { nombre: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ai = AREA_ORDER.indexOf(a.nombre);
    const bi = AREA_ORDER.indexOf(b.nombre);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

export const WEBP_MAP: Record<string, string> = {
  'Mujeres Género y Diversidad': 'assets/mujer.webp',
  'Mujer': 'assets/mujer.webp',
  'Niñez, Adolescencia y Familia': 'assets/ninez.webp',
  'Niñez': 'assets/ninez.webp',
  'Personas Mayores': 'assets/mayores.webp',
  'Desarrollo Comunitario': 'assets/comunidad.webp',
  'Inclusión': 'assets/inclusion.webp',
  'Salud': 'assets/salud.webp',
  'Salud Social y Comunitaria': 'assets/salud.webp',
  'Trabajo y Producción': 'assets/trabajo.webp',
  'Trabajo': 'assets/trabajo.webp',
  'Deportes y Recreación': 'assets/deportes.webp',
  'Deportes': 'assets/deportes.webp',
  'Turismo': 'assets/turismo.webp',
  'Cultura': 'assets/cultura.webp',
  'Educación': 'assets/educacion.webp',
};
