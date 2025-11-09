import { Announcement, CalendarEvent, Task, ServicePrice, Psychologist, Profile, TaskStatus, TaskPriority, TaskType, TrainingMaterial, MaterialType, RegulationSection, UsefulLink, User } from '../types';

export const mockUsers: User[] = [
    { id: 'user-gestao-1', name: 'Maria Gestora', profile: Profile.Gestao, email: 'gestao@contempsico.com', password: '123' },
    { id: 'user-colab-1', name: 'João Colaborador', profile: Profile.Colaborador, email: 'colab@contempsico.com', password: '123' },
    { id: 'user-psi-1', name: 'Dr. Ana Silva', profile: Profile.Psicologo, email: 'ana.silva@contempsico.com', password: '123' },
    { id: 'user-psi-2', name: 'Dr. Bruno Costa', profile: Profile.Psicologo, email: 'bruno.costa@contempsico.com', password: '123' },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Reunião Geral da Equipe',
    content: 'Caros colaboradores,\n\nHaverá uma reunião geral obrigatória na próxima sexta-feira às 10h para discutir as metas do próximo trimestre. A presença de todos é fundamental.',
    author: 'Diretoria',
    date: '2023-10-20T10:00:00Z',
    visibility: [Profile.Colaborador, Profile.Psicologo],
  },
  {
    id: 'ann2',
    title: 'Novo Protocolo de Atendimento',
    content: 'Psicólogos, favor revisar o novo protocolo de atendimento disponível na seção de Recursos -> Treinamentos.',
    author: 'Coordenação',
    date: '2023-10-18T14:30:00Z',
    visibility: [Profile.Psicologo],
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt1',
    date: '2023-10-31',
    title: 'Manutenção do Sistema',
    status: 'Funcionamento Normal',
  },
  {
    id: 'evt2',
    date: '2023-11-03',
    title: 'Ponte Feriado',
    status: 'Fechado',
  },
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Verificar agendamento do paciente X',
    description: 'Paciente informou que não recebeu a confirmação do agendamento da próxima semana.',
    type: TaskType.GestaoDocumentosPaciente,
    status: TaskStatus.Pendente,
    priority: TaskPriority.Alta,
    requester: 'Dr. Ana Silva',
    assignedTo: ['user-colab-1'],
    creationDate: '2023-10-22T09:00:00Z',
    startDate: '2023-10-23',
    endDate: '2023-10-24',
    patientName: 'Paciente X',
    folderUrl: 'https://example.com/docs/paciente-x',
  },
  {
    id: 'task2',
    title: 'Atualizar material de onboarding',
    description: 'Incluir as novas políticas de benefícios no material de onboarding para novos colaboradores.',
    type: TaskType.ExecutarTarefaRotina,
    status: TaskStatus.EmAndamento,
    priority: TaskPriority.Media,
    requester: 'Maria Gestora',
    assignedTo: ['user-gestao-1', 'user-colab-1'],
    creationDate: '2023-10-20T11:00:00Z',
    startDate: '2023-10-25',
    endDate: yesterday.toISOString().split('T')[0], // Atrasada
    conclusionNotes: 'Tarefa finalizada em atrazo pq o paciente demorou para dar o retorno.',
    subtasks: [
        { id: 'sub1', title: 'Revisar políticas atuais', completed: true },
        { id: 'sub2', title: 'Redigir seção de benefícios', completed: true },
        { id: 'sub3', title: 'Adicionar informações sobre plano de saúde', completed: false },
        { id: 'sub4', title: 'Enviar para aprovação da diretoria', completed: false },
    ]
  },
  {
    id: 'task3',
    title: 'Relatório mensal de atendimentos',
    description: 'Preparar o relatório com o total de sessões realizadas no mês de Outubro.',
    type: TaskType.SolicitacaoDocumentosProfissional,
    status: TaskStatus.Concluida,
    priority: TaskPriority.Media,
    requester: 'Maria Gestora',
    assignedTo: ['user-psi-1', 'user-psi-2'],
    creationDate: '2023-10-15T09:00:00Z',
    conclusionDate: '2023-10-28T17:00:00Z',
    attachmentUrl: 'https://example.com/relatorio.pdf',
    conclusionNotes: 'Relatório finalizado e enviado para a diretoria. Todos os dados foram consolidados.'
  },
  {
    id: 'task4',
    title: 'Organizar arquivos antigos',
    description: 'Arquivar prontuários de pacientes com alta há mais de 5 anos.',
    type: TaskType.GestaoDocumentosColaborador,
    status: TaskStatus.Arquivada,
    priority: TaskPriority.Media,
    requester: 'Maria Gestora',
    assignedTo: ['user-colab-1'],
    creationDate: '2023-09-01T10:00:00Z',
  },
];

export const mockServices: ServicePrice[] = [
  {
    id: 'svc1',
    serviceName: 'Sessão de Psicoterapia Individual',
    description: 'Sessão com duração de 50 minutos.',
    value: 150.00,
    visibility: [Profile.Colaborador, Profile.Psicologo],
  },
  {
    id: 'svc2',
    serviceName: 'Terapia de Casal',
    description: 'Sessão com duração de 80 minutos para casais.',
    value: 250.00,
    visibility: [Profile.Colaborador, Profile.Psicologo],
  },
  {
    id: 'svc3',
    serviceName: 'Avaliação Neuropsicológica',
    description: 'Pacote completo de avaliação com devolutiva.',
    value: 1200.00,
    visibility: [Profile.Gestao],
  },
];

export const mockPsychologists: Psychologist[] = [
  {
    id: 'psi1',
    name: 'Dr. Ana Silva',
    crp: '06/123456',
    phone: '(11) 98765-4321',
    email: 'ana.silva@contempsico.com.br',
    specialty: 'Terapia Cognitivo-Comportamental',
    cpf: '123.456.789-00',
    graduationUniversity: 'Universidade de São Paulo (USP)',
    specializationUniversity: 'Instituto de Psiquiatria - HCFMUSP',
    theoreticalApproach: 'Foco em reestruturação cognitiva para tratamento de ansiedade e depressão, utilizando técnicas baseadas em evidências para promover mudanças de comportamento e pensamento.'
  },
  {
    id: 'psi2',
    name: 'Dr. Bruno Costa',
    crp: '06/654321',
    phone: '(11) 91234-5678',
    email: 'bruno.costa@contempsico.com.br',
    specialty: 'Psicanálise',
    cpf: '987.654.321-99',
    graduationUniversity: 'Pontifícia Universidade Católica (PUC-SP)',
    specializationUniversity: 'Instituto Sedes Sapientiae',
    theoreticalApproach: 'Abordagem psicanalítica com foco na exploração do inconsciente e na análise da relação transferencial como meio de elaboração de conflitos psíquicos.'
  },
];

export const mockTrainings: TrainingMaterial[] = [
    { id: 't1', title: 'Onboarding de Novos Colaboradores', description: 'Vídeo completo com o processo de boas-vindas.', type: MaterialType.Video, category: 'Integração', url: '#' },
    { id: 't2', title: 'Manual do Sistema Interno', description: 'Documento PDF com todas as funcionalidades.', type: MaterialType.PDF, category: 'Ferramentas', url: '#' },
];

export const mockRegulations: RegulationSection[] = [
    { id: 'r1', title: 'Código de Conduta', content: 'Este é o conteúdo detalhado sobre o código de conduta...', visibility: [Profile.Colaborador, Profile.Psicologo] },
    { id: 'r2', title: 'Política de Férias', content: 'Este é o conteúdo detalhado sobre a política de férias...', visibility: [Profile.Colaborador, Profile.Psicologo] },
];

export const mockLinks: UsefulLink[] = [
    { id: 'l1', category: 'Ferramentas', title: 'Sistema de Agendamento', url: '#', visibility: [Profile.Colaborador, Profile.Psicologo] },
    { id: 'l2', category: 'Benefícios', title: 'Portal do Plano de Saúde', url: '#', visibility: [Profile.Colaborador, Profile.Psicologo] },
    { id: 'l3', category: 'Ajuda', title: 'Como usar o portal', url: '#', visibility: [Profile.Colaborador, Profile.Psicologo] },
];