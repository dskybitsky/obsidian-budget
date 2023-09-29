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

export const Table = ({ value, periods, transactions }: TableProps) => {
    const getPeriodOverturn = (periodTransactions: TransactionDto[]) => periodTransactions.reduce(
        (sum, transaction) => ([
            sum[0] + (transaction.type === 'plan' ? transaction.value : 0),
            sum[1] + (transaction.type === 'fact' ? transaction.value : 0),
        ]),
        [0, 0],
    );

    let prevPeriodEndValueFact = value;

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
                const periodOverturn = getPeriodOverturn(transactions[index]);

                const periodEndValueFact = prevPeriodEndValueFact + periodOverturn[1];
                const hasGap = Math.abs(period.value - prevPeriodEndValueFact) > 0.01;

                const row = (
                    <Fragment key={period.name}>
                        { hasGap && (
                            <>
                                <span>-</span>
                                <span><Value value={prevPeriodEndValueFact} /></span>
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
                            <Value value={periodEndValueFact} />
                        </span>
                    </Fragment>
                );

                prevPeriodEndValueFact = periodEndValueFact;

                return row;
            })}
        </div>
    );
};
