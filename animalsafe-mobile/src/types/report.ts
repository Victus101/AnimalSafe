/**
 * Report Types
 */

export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type AnimalType = 'Perro' | 'Gato' | 'Pajaro' | 'Roedor' | 'Otro';
export type AnimalCondition = 'Herido' | 'Abandonado' | 'En peligro' | 'Perdido' | 'Otro';

export interface Report {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  animalType: AnimalType;
  animalCondition: AnimalCondition;
  animalDescription: string;
  status: ReportStatus;
  userId: number;
  userName?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  distance?: number;
}

export interface CreateReportDTO {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  animalType: AnimalType;
  animalCondition: AnimalCondition;
  animalDescription: string;
}

export interface UpdateReportStatusDTO {
  newStatus: ReportStatus;
}

export interface ReportDetail extends Report {
  images: ReportImage[];
}

export interface ReportImage {
  id: number;
  reportId: number;
  imageUrl: string;
  fileName: string;
  createdAt: string;
}
