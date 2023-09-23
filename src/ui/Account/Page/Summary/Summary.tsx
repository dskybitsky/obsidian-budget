import React from 'react';
import { Value } from '../../../Value';
import { Summary as SummaryElement } from '../../../Summary';

export interface SummaryProps {
    value: number;
}

export const Summary = ({ value }: SummaryProps) => (
    <SummaryElement>
        <span>
            <span>Начальный баланс:</span>
            <Value value={value} />
        </span>
    </SummaryElement>
);
