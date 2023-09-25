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

    const parent = budget.getParent(path);

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
                await budget.createTransactionPage(category.folder, newTransaction);
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
            parent={parent}
            category={category}
            transactions={transactions}
            onCreate={(value) => setNewTransaction(value)}
        />
    );
};
