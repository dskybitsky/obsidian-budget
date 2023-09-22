import React from 'react';
import { TransactionDto } from '../../../services';
import { Plate } from './Plate';

export interface PageProps {
    transaction: TransactionDto;
}

export const Page = ({ transaction }: PageProps) => (
    <div className="transaction">
        <h1>{transaction.title}</h1>
        <Plate transaction={transaction} />
    </div>
);
