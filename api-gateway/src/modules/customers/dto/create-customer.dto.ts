export interface CreateCustomerDto {
  company_name: string;
  email: string;
}

export interface UpdateCustomerDto {
  company_name?: string;
  email?: string;
}
