
export interface AdminDashboardApiResponse{
  
}

export interface EmployeeDashboardData {
  period: { start: string; end: string } | any;
  totalHours: number;
  dailyTrend: {
    date: string;
    dayName: string;
    totalHours: number;
    projects: string[];
  }[];
  projectCount: number;
}

export interface ProjectCounts {
  total: number;
  open: number;
  closed: number;
  paused?: number;
}

export interface MostLoggedProject {
  projectId: string;
  projectName?: string;
  totalHours: number;
}

export interface HoursByUnit {
  unitName: string;
  totalHours: number;
}

export interface MonthlyTrendItem {
  month: string;
  totalHours: number;
}

export interface AdminDashboardData {
  period: { start: string; end: string } | any;
  projectCounts: ProjectCounts;
  totalEmployees: number;
  totalHours: number;
  mostLoggedProjects: MostLoggedProject[];
  hoursByUnits: HoursByUnit[];
  monthlyTrend: MonthlyTrendItem[];
  avgHoursPerProject: number;
}


