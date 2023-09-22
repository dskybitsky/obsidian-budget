import React, { useEffect, useState } from 'react';
import { setActiveTabTitle } from 'skybitsky-common';
import { BudgetInterface, TransactionCreateDto } from '../../services';
import { Page } from './Page';

export interface CategoryProps {
    budget: BudgetInterface;
    path: string;
}

export const Category = ({ budget, path }: CategoryProps) => {
    const category = budget.getCategory(path);

    const transactions = budget.getTransactions(path, true);

    const [
        newTransaction,
        setNewTransaction,
    ] = useState<TransactionCreateDto | undefined>(undefined);

    useEffect(() => {
        if (!newTransaction) {
            return;
        }

        (async () => {
            try {
                await budget.createTransactionPage(path, newTransaction);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }

            setNewTransaction(undefined);
        })();
    }, [newTransaction]);

    setActiveTabTitle(category.title);

    return (
        <Page
            category={category}
            transactions={transactions}
            onCreate={(value) => setNewTransaction(value)}
        />
    );
};
