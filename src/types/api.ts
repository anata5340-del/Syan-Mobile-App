export type LoginPayload = { email: string; password: string };

export type PackageItem = {
  _id: string;
  startDate: string;
  endDate: string;
  active: boolean;
  price: number;
};

export type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  packages?: PackageItem[];
  displayId?: string;
  country: string;
  city: string;
  address: string;
  institute: string;
  jobStatus: string;
  jobLocation: string;
  yearOfGraduation: string;
  cnic: string;
  phone: string;
  password: string;
  cnicFront?: string;
  cnicBack?: string;

  // add other
};

export type LoginResponse = {
  user: User;
  token: string;
};
