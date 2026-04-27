export interface User {
  _id: string;
  аты: string;
  эл_пошта: string;
  рөлі: 'admin' | 'manager' | 'user';
  белсенді: boolean;
}

export interface Client {
  _id: string;
  аты: string;
  эл_пошта: string;
  телефон: string;
  компания?: string;
  мекен_жай?: string;
  статус: 'белсенді' | 'болашақ' | 'бұрынғы';
  жауапты_менеджер?: User | string;
  ескертпелер?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sale {
  _id: string;
  тақырып: string;
  клиент: Client | string;
  менеджер?: User | string;
  сомасы: number;
  статус: 'жаңа' | 'байланыс' | 'ұсыныс' | 'келіссөз' | 'жабық_жеңіс' | 'жабық_жеңіліс';
  мүмкіндік_пайызы: number;
  болжамды_жабылу?: string;
  ескертпелер?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  _id: string;
  тақырып: string;
  түрі: 'қоңырау' | 'кездесу' | 'хат' | 'тапсырма' | 'басқа';
  сипаттамасы?: string;
  клиент?: Client | string;
  менеджер?: User | string;
  күні: string;
  статус: 'жоспарланған' | 'аяқталған' | 'болдырылмаған';
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  клиент_саны: number;
  сату_саны: number;
  іс_әрекет_саны: number;
  жалпы_түсім: number;
  статус_бойынша_сату: Record<string, number>;
  ай_бойынша_сату?: Array<{ ай: string; сомасы: number }>;
  соңғы_іс_әрекеттер?: Activity[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}
