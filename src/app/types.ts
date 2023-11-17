import { z } from "zod";

export interface RawTransaction {
  saleDate: number;
  psf: number;
}

export interface Transaction {
  saleDate: string;
  psf: number;
}

export const FilterOptionsSchema = z.object({
  projectName: z.string().array(),
  price: z.number().array().length(2),
  sqft: z.number().array().length(2),
  psf: z.number().array().length(2),
  saleDate: z.string().array(),
  streetName: z.string().array(),
  saleType: z.string().array(),
  areaType: z.string().array(),
  propertyType: z.string().array(),
  leaseType: z.string().array(),
  leaseLength: z.number().array(),
  topYear: z.number().array().length(2),
  district: z.number().array(),
  marketSegment: z.string().array(),
  lowFloorLevel: z.string().array(),
  highFloorLevel: z.string().array(),
});

export type FilterOptions = z.infer<typeof FilterOptionsSchema>;
