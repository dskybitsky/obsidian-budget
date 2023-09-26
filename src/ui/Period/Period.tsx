import React, { useEffect, useState } from 'react';
import { Message, setActiveTabTitle } from 'skybitsky-common';
import { BudgetInterface } from '../../services';
import { Page } from './Page';

export interface PeriodProps {
    budget: BudgetInterface;
    path: string;
}

export const Period = ({ budget, path }: PeriodProps) => {
    const localStorageHideZerosParam = `${path}:hideZeros`;

    const [hideZeros, setHideZeros] = useState(false);

    const period = budget.getPeriod(path);

    if (!period) {
        return <Message severity="error">Error: data not found</Message>;
    }

    const categories = budget.getCategories(path);

    const parent = budget.getParent(path);

    useEffect(() => {
        const localStorageHideZeros = localStorage.getItem(localStorageHideZerosParam);

        setHideZeros(
            localStorageHideZeros
                ? JSON.parse(localStorageHideZeros)
                : false,
        );
    }, []);

    useEffect(() => {
        localStorage.setItem(
            localStorageHideZerosParam,
            JSON.stringify(hideZeros),
        );
    }, [hideZeros]);

    setActiveTabTitle(period.title);

    return (
        <Page
            parent={parent}
            period={period}
            categories={categories}
            hideZeroes={hideZeros ?? false}
            onHideZeroesChange={(value) => setHideZeros(value)}
        />
    );
};
