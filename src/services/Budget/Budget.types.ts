export type Dto = {
    name: string;
    title: string;
    path: string;
};

export type AccountDto = Dto & {
    value: number;
};

export type PeriodDto = Dto & {
    value: number;
};

export type CategoryDto = Dto & {
    icon?: string;
    value: number;
    categories: CategoryDto[];
    total: { plan: number; fact: number };
    dir: 'in' | 'out';
    folder: string,
};

export type TransactionDto = Dto & {
    value: number;
    type: 'plan' | 'fact';
    date: Date;
};

export type TransactionCreateDto = Omit<TransactionDto, 'path'>;
