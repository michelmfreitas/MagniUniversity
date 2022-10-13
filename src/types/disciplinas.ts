import { ProfessoresProps } from './professores'

export interface DisciplinasProps {
  id: string
  name: string
  professor: Array<ProfessoresProps>
}
