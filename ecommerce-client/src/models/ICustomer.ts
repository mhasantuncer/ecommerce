export interface ICustomer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
  created_at: string;
}

// For form data (without id, created_at, and optional password)
export type CustomerFormValues = Pick<
  ICustomer,
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'phone'
  | 'street_address'
  | 'postal_code'
  | 'city'
  | 'country'
> & {
  password?: string; // Explicitly optional
};

// For API create operations (matches your existing CustomerCreate)
export type CustomerCreate = Pick<
  ICustomer,
  | 'firstname'
  | 'lastname'
  | 'email'
  | 'password'
  | 'phone'
  | 'street_address'
  | 'postal_code'
  | 'city'
  | 'country'
>;

// For API update operations (matches your existing CustomerUpdate)
export type CustomerUpdate = Partial<CustomerCreate>;

// For form validation errors
export interface CustomerFormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  street_address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
}

// Props for CustomerForm component
export interface CustomerFormProps {
  onValidSubmit: (values: CustomerFormValues) => void;
  disabled?: boolean;
  initialValues?: Partial<CustomerFormValues>;
}
