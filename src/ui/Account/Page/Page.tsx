import React from 'react';
import { AccountDto, PeriodDto, TransactionDto } from '../../../services';
import { Summary } from './Summary';
import { Table } from './Table';
import { Header } from '../../Header';

export interface PageProps {
    account: AccountDto;
    periods: PeriodDto[];
    transactions: TransactionDto[][];
}

export const Page = ({ account, periods, transactions }: PageProps) => (
    <div className="account">
        <Header title={account.title} />
        <Summary value={account.value} />
        <Table
            value={account.value}
            periods={periods}
            transactions={transactions}
        />
    </div>
);
