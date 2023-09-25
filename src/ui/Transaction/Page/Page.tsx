import React from 'react';
import { Dto, TransactionDto } from '../../../services';
import { Plate } from './Plate';
import { Header } from '../../Header';

export interface PageProps {
    parent: Dto,
    transaction: TransactionDto;
}

export const Page = ({ parent, transaction }: PageProps) => (
    <div className="transaction">
        <Header parent={parent} title={transaction.title} />
        <Plate transaction={transaction} />
    </div>
);
