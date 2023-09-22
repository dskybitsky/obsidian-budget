import React from 'react';
import { Value } from '../../../Value';

export interface SummaryProps {
    value: number;
}

export const Summary = ({ value }: SummaryProps) => (
    <div className="summary">
        <span>
            Начальный баланс:
            <Value value={value} />
        </span>
    </div>
);
