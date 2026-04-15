export interface CreateAddressDto {
  street: string;
  city: string;
}

export interface UpdateAddressDto {
  street?: string;
  city?: string;
}
