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

    const eq = (a: number, b:number, delta: number = 0.01) => Math.abs(a - b) < delta;

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

                const periodEndValuePlan = prevPeriodEndValueFact + periodOverturn[0];
                const periodEndValueFact = prevPeriodEndValueFact + periodOverturn[1];
                const hasGap = !eq(period.value, prevPeriodEndValueFact);

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
                        {eq(periodEndValueFact, periodEndValuePlan)
                            ? (
                                <span>
                                    <Value value={periodEndValueFact} />
                                </span>
                            ) : (
                                <span className="multi">
                                    <Value key="fact" value={periodEndValueFact} />
                                    <span>
                                        (
                                        <Value key="plan" value={periodEndValuePlan} />
                                        )
                                    </span>
                                </span>
                            )}
                    </Fragment>
                );

                prevPeriodEndValueFact = periodEndValueFact;

                return row;
            })}
        </div>
    );
};
