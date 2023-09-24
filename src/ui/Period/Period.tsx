import React, { useEffect, useState } from 'react';
import { setActiveTabTitle } from 'skybitsky-common';
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
    const categories = budget.getCategories(path);

    useEffect(() => {
        const localStorageHideZeros = JSON.parse(
            localStorage.getItem(localStorageHideZerosParam),
        );

        setHideZeros(localStorageHideZeros ?? false);
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
            period={period}
            categories={categories}
            hideZeroes={hideZeros ?? false}
            onHideZeroesChange={(value) => setHideZeros(value)}
        />
    );
};
