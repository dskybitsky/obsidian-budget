import React from 'react';
import { Value } from '../../../Value';

export interface SummaryProps {
    value: number;
    fact: number;
    plan: number;
}

export const Summary = ({ value, fact, plan }: SummaryProps) => (
    <div className="summary">
        <span>
            <strong>
                Баланс:
                <Value value={value + fact} />
            </strong>
        </span>
        <span>
            На конец периода:
            <Value value={value + plan} />
        </span>
    </div>
);
