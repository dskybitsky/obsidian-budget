import React from 'react';

export interface DateTimeProps {
    value: Date;
    format?: 'short' | 'long';
}

export const DateTime = ({ value, format = 'short' }: DateTimeProps) => {
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        ...(format === 'long' ? {
            year: '2-digit',
            second: 'numeric',
        } : {}),
    };

    const dateTimeFormat = new Intl.DateTimeFormat(undefined, dateTimeFormatOptions);

    return <span>{dateTimeFormat.format(value)}</span>;
};
