import React from 'react';

export interface DateTimeProps {
    value: Date;
    full?: boolean;
}

export const DateTime = ({ value, full = true }: DateTimeProps) => {
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    if (full) {
        dateTimeFormatOptions.second = 'numeric';
    }

    const dateTimeFormat = new Intl.DateTimeFormat('ru', dateTimeFormatOptions);

    return <span>{dateTimeFormat.format(value)}</span>;
};
