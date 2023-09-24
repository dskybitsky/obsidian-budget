import React from 'react';
import './Type.css';

export interface TypeProps {
    value: 'plan' | 'fact',
}

export const Type = ({ value }: TypeProps) => {
    const valueString = value === 'plan'
        ? 'Запланированная'
        : 'Фактическая';

    return (
        <span className={`type-${value}`}>{ valueString }</span>
    );
};
