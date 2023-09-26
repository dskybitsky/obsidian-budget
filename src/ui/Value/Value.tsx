import React, { useContext } from 'react';
import { SettingsContext } from '../../core/contexts';

export interface ValueProps {
    value: number,
}

export const Value = ({ value }: ValueProps) => {
    const settings = useContext(SettingsContext);
    const currency = settings?.currency ?? '';

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
        <span className={`dir-${dir}`}>
            {`${ico}${currency}${normalizedValue.toFixed(2)}`}
        </span>
    );
};
