export interface CreateProjectDto {
  name: string;
  customer_id: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  customer_id?: string;
  description?: string;
}
