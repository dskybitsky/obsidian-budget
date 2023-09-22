import React, { ReactNode } from 'react';
import './Block.css';

export interface BlockProps {
    label: string;
    children?: ReactNode;
}

export const Block = ({ label, children }: BlockProps) => (
    <div className="transaction-plate-block">
        <span>{ label }</span>
        { children }
    </div>
);
