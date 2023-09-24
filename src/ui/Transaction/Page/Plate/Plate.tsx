import React from 'react';
import { TransactionDto } from '../../../../services';
import { Block } from './Block';
import { DateTime } from '../../../DateTime';
import { Value } from '../../../Value';
import { Type } from '../../../Type';
import './Plate.css';

export interface PlateProps {
    transaction: TransactionDto;
}

export const Plate = ({ transaction }: PlateProps) => (
    <div className="transaction-plate">
        <Block label="Дата:">
            <DateTime value={transaction.date} full />
        </Block>
        <Block label="Тип:">
            <Type value={transaction.type} />
        </Block>
        <Block label="Сумма:">
            <Value value={transaction.value} />
        </Block>
    </div>
);
