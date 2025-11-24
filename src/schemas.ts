import { z } from 'zod';

export const BankDataSchema = z.object({
  rate: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) || 0 : val
  ),
  min: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) || 0 : val
  ),
  icon: z.union([z.string(), z.null()]).transform(val => 
    typeof val === 'string' ? val : ''
  )
});

export const BankDataAltSchema = z.object({
  interest: z.number().min(0, "Interest rate must be non-negative"),
  minDeposit: z.number().min(0, "Minimum deposit must be non-negative"),
  icon: z.string().default('')
});

export const BanksDataSchema = z.record(z.string(), BankDataSchema);

export type BankData = z.infer<typeof BankDataSchema>;
export type BanksData = z.infer<typeof BanksDataSchema>;

export const BankWithNameSchema = z.object({
  name: z.string(),
  data: BankDataSchema
});

export type BankWithName = z.infer<typeof BankWithNameSchema>;