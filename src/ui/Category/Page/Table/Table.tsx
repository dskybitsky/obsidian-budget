import React from 'react';
import { InternalLink } from 'skybitsky-common';
import { TransactionDto } from '../../../../services';
import { Value } from '../../../Value';
import { DateTime } from '../../../DateTime';
import './Table.css';

export interface TableProps {
    transactions: TransactionDto[];
}

// @todo create base component table
export const Table = ({ transactions }: TableProps) => (
    <div className="table category-table">
        <span><strong>Дата</strong></span>
        <span><strong>Описание</strong></span>
        <span><strong>€</strong></span>
        {transactions.map((transaction) => [
            <span>
                <InternalLink path={transaction.path}>
                    <DateTime value={transaction.date} />
                </InternalLink>
            </span>,
            <span>{transaction.title}</span>,
            <span>
                <Value value={transaction.value} />
            </span>,
        ])}
    </div>
);
