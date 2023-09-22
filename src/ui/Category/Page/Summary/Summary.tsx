import React from 'react';
import { Value } from '../../../Value';

export interface SummaryProps {
    factTotal: number;
    planTotal: number;
}

export const Summary = ({ factTotal, planTotal }: SummaryProps) => (
    <div className="summary">
        <span>
            План:
            <Value value={planTotal} />
        </span>
        <span>
            Факт:
            <Value value={factTotal} />
        </span>
        <span>
            Остаток:
            <Value value={factTotal - planTotal} />
        </span>
    </div>
);
