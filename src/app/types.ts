export interface RawTransaction {
  saleDate: number;
  psf: number;
}

export interface Transaction {
  saleDate: string;
  psf: number;
}
export interface FilterOptions {
  projectName: string[];
  price: number[];
  sqft: number[];
  psf: number[];
  saleDate: string[];
  streetName: string[];
  saleType: string[];
  areaType: string[];
  propertyType: string[];
  leaseType: string[];
  leaseLength: number[];
  topYear: number[];
  district: number[];
  marketSegment: string[];
  lowFloorLevel: string[];
  highFloorLevel: string[];
}
