const WOW_COPY: Record<string, string> = {
  'Dashboard': 'Campamento Base',
  'Tareas': 'Misiones',
  'Tareas & Focus': 'Misiones y Enfoque',
  'Nueva Tarea': 'Nueva Misión',
  'Pendientes': 'Misiones Activas',
  'Completadas': 'Misiones Cumplidas',
  'Papelera': 'Misiones Abandonadas',
  'Temporizador Pomodoro': 'Modo Mazmorra',
  'Enfoque': 'Incursión',
  'Corto': 'Respiro',
  'Largo': 'Campamento',
  'Rachas': 'Racha del Aventurero',
  'días seguidos': 'días de aventura consecutivos',
  'día seguido': 'día de aventura',
  'Calendario': 'Calendario de Misiones',
  'Configuración': 'Campamento',
  'Chat': 'Oráculo',
  'Próximos Exámenes': 'Jefes Próximos',
  'Cursos Activos': 'Gremios Activos',
  'Tareas Pendientes': 'Misiones Activas',
  'Actividad Reciente': 'Bitácora de Aventuras',
  'Ver tour guiado': 'Guía del Aventurero',
};

export const wowLabel = (mode: string, text: string): string =>
  mode === 'wow' ? (WOW_COPY[text] || text) : text;
