import React from 'react';
import { setActiveTabTitle } from 'skybitsky-common';
import { BudgetInterface } from '../../services';
import { Page } from './Page';

export interface TransactionProps {
    budget: BudgetInterface;
    path: string;
}

export const Transaction = ({ budget, path }: TransactionProps) => {
    const transaction = budget.getTransaction(path);
    const parent = budget.getParent(path, 1);

    setActiveTabTitle(transaction.title);

    return <Page parent={parent} transaction={transaction} />;
};
