import React, { ReactNode } from 'react';
import './Summary.css';

export interface SummaryProps {
    children?: ReactNode
}

export const Summary = ({ children }: SummaryProps) => (
    <div className="summary">
        { children }
    </div>
);
