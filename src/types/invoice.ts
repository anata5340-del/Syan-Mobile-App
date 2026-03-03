export interface InvoicePackageInfo {
  _id: string;
  name: string;
  displayId: string;
  price?: number;
}

export interface InvoiceItem {
  _id: string;
  startDate: string;
  endDate: string;
  active: boolean; // status
  price: number;
  packageInfo: InvoicePackageInfo;
}

export interface InvoiceResponse {
  pkgs: InvoiceItem[];
}
