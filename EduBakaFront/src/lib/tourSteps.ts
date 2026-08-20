import { LayoutDashboard, CheckCircle, Flame, Calendar, MessageCircle, Settings, type LucideIcon } from 'lucide-react';

export interface TourStep {
  path: string;
  icon: LucideIcon;
  title: string;
  wowTitle: string;
  body: string;
  wowBody: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    wowTitle: 'Campamento Base',
    body: 'Tu resumen: exámenes próximos, cursos activos, tareas pendientes y tu actividad reciente, todo de un vistazo.',
    wowBody: 'Tu campamento base: aquí ves tus próximos jefes, gremios activos, misiones pendientes y tu bitácora de aventuras.',
  },
  {
    path: '/tasks',
    icon: CheckCircle,
    title: 'Tareas & Focus',
    wowTitle: 'Misiones y Enfoque',
    body: 'Organiza tu lista de tareas con fecha límite, prioridad y subtareas, y usa el Pomodoro para enfocarte sin cortes.',
    wowBody: 'Administra tus misiones con fecha límite y prioridad, y entra en modo mazmorra con el temporizador de enfoque.',
  },
  {
    path: '/streaks',
    icon: Flame,
    title: 'Rachas',
    wowTitle: 'Racha del Aventurero',
    body: 'Cada día que completas una tarea o un Pomodoro suma un día a tu racha. No la rompas.',
    wowBody: 'Cada misión o incursión completada suma un día a tu racha de aventura. No dejes que se apague la llama.',
  },
  {
    path: '/calendar',
    icon: Calendar,
    title: 'Calendario',
    wowTitle: 'Calendario de Misiones',
    body: 'Visualiza tus exámenes y ciclo académico en un calendario, con cada curso en su propio color.',
    wowBody: 'Visualiza tus jefes finales y ciclo académico en el calendario, cada gremio con su propio color.',
  },
  {
    path: '/chat',
    icon: MessageCircle,
    title: 'Chat',
    wowTitle: 'Oráculo',
    body: 'Haz preguntas breves de estudio a la IA. Tiene un límite diario de mensajes, así que úsalo con cabeza.',
    wowBody: 'Consulta al Oráculo tus dudas de estudio. Sus visiones diarias son limitadas, así que elige bien tus preguntas.',
  },
  {
    path: '/settings',
    icon: Settings,
    title: 'Configuración',
    wowTitle: 'Campamento',
    body: 'Personaliza tu perfil y avatar, configura tu ciclo académico y tus cursos, y cambia entre tema claro/oscuro o Modo WoW.',
    wowBody: 'Personaliza tu personaje y avatar, configura tu ciclo y tus gremios, y alterna entre el mundo real y el Modo WoW.',
  },
];
