import React, { FormEvent, useState } from 'react';
import { TransactionCreateDto } from '../../../../services';
import './Form.css';

export interface FormProps {
    type: 'plan' | 'fact',
    dir: 'in' | 'out',
    onCreate: (transaction: TransactionCreateDto) => void,
}

export const Form = ({ type, dir, onCreate }: FormProps) => {
    const [currentDir, setCurrentDir] = useState<'in' | 'out'>(dir);
    const [currentValue, setCurrentValue] = useState('');
    const [currentName, setCurrentName] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = parseFloat(currentValue);

        onCreate({
            name: currentName,
            title: currentName,
            value: (currentDir === 'in') ? value : (-1) * value,
            date: new Date(),
            type,
        });

        setCurrentName('');
        setCurrentValue('');
    };

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
                    onChange={(e) => setCurrentValue(e.target.value)}
                />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className={`toggle value-${currentDir}`}>
                    <input
                        type="checkbox"
                        checked={currentDir === 'in'}
                        onChange={(e) => setCurrentDir(e.target.checked ? 'in' : 'out')}
                    />
                    <span>{ currentDir === 'in' ? '↑' : '↓' }</span>
                </label>
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
