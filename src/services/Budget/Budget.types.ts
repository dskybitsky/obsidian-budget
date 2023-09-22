export type AccountDto = {
    name: string;
    title: string;
    value: number;
    path: string;
};

export type PeriodDto = {
    name: string;
    title: string;
    value: number;
    path: string;
};

export type CategoryDto = {
    name: string;
    title: string;
    value: number;
    categories: CategoryDto[];
    total: { plan: number; fact: number };
    dir: 'in' | 'out';
    path: string;
    folder: string,
};

export type TransactionDto = {
    name: string;
    title: string;
    value: number;
    date: Date;
    type: 'plan' | 'fact';
    path: string;
};

export type TransactionCreateDto = Omit<TransactionDto, 'path'>;
