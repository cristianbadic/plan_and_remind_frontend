export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    imageUrl: string;
    accountConfirmation?: string;
    phoneNumber: string;
    phoneNrConfirmation: string;
  }
  