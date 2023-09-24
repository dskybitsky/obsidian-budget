import React from 'react';
import { CategoryDto, TransactionDto, TransactionCreateDto } from '../../../services';
import { Summary } from './Summary';
import { Table } from './Table';
import { Form } from './Form';
import { Icon } from '../../Icon';

export interface PageProps {
    category: CategoryDto;
    transactions: TransactionDto[];
    onCreate: (transaction: TransactionCreateDto) => void;
}

export const Page = ({ category, transactions, onCreate }: PageProps) => {
    const planTransactions = transactions.filter(
        (transaction) => transaction.type === 'plan',
    );

    const factTransactions = transactions.filter(
        (transaction) => transaction.type === 'fact',
    );

    const planTotal = planTransactions.reduce(
        (sum, transaction) => sum + transaction.value,
        0,
    );

    const factTotal = factTransactions.reduce(
        (sum, transaction) => sum + transaction.value,
        0,
    );

    return (
        <div className="category">
            <h1>
                {category.icon && <Icon name={category.icon} size={32} />}
                <span>{category.title}</span>
            </h1>
            <Summary planTotal={planTotal} factTotal={factTotal} />
            <h2>Фактические</h2>
            <Form onCreate={onCreate} type="fact" dir={category.dir} />
            {factTransactions.length > 0 && (
                <Table transactions={factTransactions} />
            )}
            <h2>Запланированные</h2>
            <Form onCreate={onCreate} type="plan" dir={category.dir} />
            {planTransactions.length > 0 && (
                <Table transactions={planTransactions} />
            )}
        </div>
    );
};
