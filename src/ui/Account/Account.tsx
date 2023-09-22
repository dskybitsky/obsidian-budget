import React from 'react';
import { setActiveTabTitle } from 'skybitsky-common';
import { BudgetInterface } from '../../services';
import { Page } from './Page';

export interface AccountProps {
    budget: BudgetInterface;
    path: string;
}

export const Account = ({ budget, path }: AccountProps) => {
    const account = budget.getAccount(path);
    const periods = budget.getPeriods(path);
    const transactions = periods
        .map((period) => budget.getTransactions(period.path, true));

    setActiveTabTitle(account.title);

    return (
        <Page account={account} periods={periods} transactions={transactions} />
    );
};
