import React from 'react';
import { Value } from '../../../Value';
import { Summary as SummaryElement } from '../../../Summary';

export interface SummaryProps {
    factTotal: number;
    planTotal: number;
}

export const Summary = ({ factTotal, planTotal }: SummaryProps) => (
    <SummaryElement>
        <span>
            <span>План:</span>
            <Value value={planTotal} />
        </span>
        <span>
            <span>Факт:</span>
            <Value value={factTotal} />
        </span>
        <span>
            <span>Остаток:</span>
            <Value value={factTotal - planTotal} />
        </span>
    </SummaryElement>
);
