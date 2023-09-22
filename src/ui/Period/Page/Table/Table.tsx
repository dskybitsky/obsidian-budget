import React, { Fragment, ReactNode } from 'react';
import { InternalLink } from 'skybitsky-common';
import { CategoryDto } from '../../../../services';
import { Value } from '../../../Value';
import './Table.css';

export interface TableProps {
    plan: number;
    fact: number;
    categories: CategoryDto[];
    hideZeroes?: boolean;
}
// @todo create base component table
export const Table = ({
    plan,
    fact,
    categories,
    hideZeroes = false,
}: TableProps) => {
    const renderRows = (category: CategoryDto, level = 1): ReactNode[] => {
        const firstSpanStyle = { paddingLeft: `${level}rem` };

        const categoryRest = category.total.fact - category.total.plan;

        const nextRows = (category.categories ?? [])
            .map((child) => renderRows(child, level + 1));

        const showCurrentRow = !hideZeroes || Math.abs(categoryRest) > 0.001;

        // @todo icon
        return showCurrentRow
            ? [
                <Fragment key={category.name}>
                    <span style={firstSpanStyle}>
                        <InternalLink path={category.path}>{category.title}</InternalLink>
                    </span>
                    <span><Value value={category.total.plan} /></span>
                    <span><Value value={category.total.fact} /></span>
                    <span><Value value={categoryRest} /></span>
                </Fragment>,
                ...nextRows,
            ] : nextRows;
    };

    return (
        <div className="table period-table">
            <span><strong>Категория</strong></span>
            <span><strong>План</strong></span>
            <span><strong>Факт</strong></span>
            <span><strong>Остаток</strong></span>
            <span><strong>Всего</strong></span>
            <span><strong><Value value={plan} /></strong></span>
            <span><strong><Value value={fact} /></strong></span>
            <span><strong><Value value={fact - plan} /></strong></span>
            {categories.map((category) => renderRows(category))}
        </div>
    );
};
