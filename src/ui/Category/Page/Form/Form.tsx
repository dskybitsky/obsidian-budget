import React, { FormEvent, useState } from 'react';
import { TransactionCreateDto } from '../../../../services';
import './Form.css';

export interface FormProps {
    type: 'plan' | 'fact',
    dir: 'in' | 'out',
    onCreate: (transaction: TransactionCreateDto) => void,
}

export const Form = ({ type, dir, onCreate }: FormProps) => {
    // const [currentDir, setCurrentDir] = useState(dir);
    const [currentValue, setCurrentValue] = useState(undefined);
    const [currentName, setCurrentName] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onCreate({
            name: currentName,
            title: currentName,
            value: currentValue,
            date: new Date(),
            type,
        });

        // e.target.reset();
    };

    // @todo dir-toggle
    return (
        <form onSubmit={handleSubmit}>
            <div className="category-form">
                <input
                    name="value"
                    type="number"
                    step="0.01"
                    placeholder="€"
                    inputMode="decimal"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
                />
                <input
                    name="name"
                    type="text"
                    placeholder="Название"
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                />
                <input type="submit" value="Добавить" />
            </div>
        </form>
    );
};
