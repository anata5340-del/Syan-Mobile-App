export type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  institute: string;
  jobStatus: string;
  jobLocation: string;
  yearOfGraduation: string;
  cnic: string;
};

export type FieldConfig = {
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'number-pad' | 'email-address';
  icon?: any;
};
