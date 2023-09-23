import React from 'react';
import './Value.css';

export interface ValueProps {
    value: number,
}

export const Value = ({ value }: ValueProps) => {
    const roundValue = Math.round(value * 100) / 100;
    const normalizedValue = Math.abs(roundValue);

    let dir = 'zero';
    let ico = '';

    if (roundValue > 0) {
        dir = 'in';
        ico = '↑';
    } else if (roundValue < 0) {
        dir = 'out';
        ico = '↓';
    }

    return (
        <span className={`value-${dir}`}>
            { `${ico}€${normalizedValue.toFixed(2)}` }
        </span>
    );
};
