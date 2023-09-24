import React from 'react';
import { Value } from '../../../Value';
import { Summary as SummaryElement } from '../../../Summary';

export interface SummaryProps {
    value: number;
    fact: number;
    plan: number;
}

export const Summary = ({ value, fact, plan }: SummaryProps) => (
    <SummaryElement>
        <span>
            <strong>
                <span>Баланс:</span>
                <Value value={value + fact} />
            </strong>
        </span>
        <span>
            <span>На конец периода:</span>
            <Value value={value + plan} />
        </span>
    </SummaryElement>
);
