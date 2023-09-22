import React, { Fragment } from 'react';
import { InternalLink } from 'skybitsky-common';
import { PeriodDto, TransactionDto } from '../../../../services';
import { Value } from '../../../Value';
import './Table.css';

export interface TableProps {
    value: number;
    periods: PeriodDto[];
    transactions: TransactionDto[][];
}
// @todo create base component table
export const Table = ({ value, periods, transactions }: TableProps) => {
    const getValueEnd = (periodTransactions: TransactionDto[]) => periodTransactions.reduce(
        (sum, transaction) => sum + (transaction.type === 'fact' ? transaction.value : 0),
        0,
    );

    let prevEndValue = value;

    return (
        <div className="table account-table">
            <span>
                <strong>Период</strong>
            </span>
            <span>
                <strong>Начало</strong>
            </span>
            <span>
                <strong>Конец</strong>
            </span>

            {periods.map((period, index) => {
                const valueEnd = getValueEnd(transactions[index]);
                const hasGap = Math.abs(period.value - prevEndValue) > 0.01;

                prevEndValue = valueEnd;

                return (
                    <Fragment key={period.name}>
                        { hasGap && (
                            <>
                                <span>-</span>
                                <span><Value value={prevEndValue} /></span>
                                <span><Value value={period.value} /></span>
                            </>
                        )}
                        <span>
                            <InternalLink path={period.path}>
                                {period.title}
                            </InternalLink>
                        </span>
                        <span>
                            <Value value={period.value} />
                        </span>
                        <span>
                            <Value value={valueEnd} />
                        </span>
                    </Fragment>
                );
            })}
        </div>
    );
};
