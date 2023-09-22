import React from 'react';
import { ToolBar, ToolBarCheck } from 'skybitsky-common';
import {
    CategoryDto,
    PeriodDto,
} from '../../../services';
import { Summary } from './Summary';
import { Table } from './Table';

export interface PageProps {
    period: PeriodDto;
    categories: CategoryDto[];
    hideZeroes?: boolean;
    onHideZeroesChange: (value: boolean) => void;
}

export const Page = ({
    period,
    categories,
    hideZeroes,
    onHideZeroesChange,
}: PageProps) => {
    const plan = categories.reduce(
        (sum, category) => sum + category.total.plan,
        0,
    );

    const fact = categories.reduce(
        (sum, category) => sum + category.total.fact,
        0,
    );

    return (
        <div className="period">
            <ToolBar>
                <ToolBarCheck
                    label="Скрыть освоенные"
                    checked={hideZeroes}
                    onChange={onHideZeroesChange}
                />
            </ToolBar>
            <h1>{period.title}</h1>
            <Summary value={period.value} plan={plan} fact={fact} />
            <Table
                plan={plan}
                fact={fact}
                categories={categories}
                hideZeroes={hideZeroes}
            />
        </div>
    );
};
