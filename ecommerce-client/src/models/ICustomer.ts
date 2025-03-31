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
  password?: string;
};

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

export type CustomerUpdate = Partial<CustomerCreate>;

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

export interface CustomerFormProps {
  onValidSubmit: (values: CustomerFormValues) => void;
  disabled?: boolean;
  initialValues?: Partial<CustomerFormValues>;
}
