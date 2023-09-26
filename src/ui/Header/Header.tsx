import React from 'react';
import { InternalLink } from 'skybitsky-common';
import { Dto } from '../../services';
import { Icon } from '../Icon';
import './Header.css';

export interface PageProps {
    title: string;
    parent?: Dto,
    icon?: string;
}

export const Header = ({ title, parent, icon }: PageProps) => (
    <h1>
        {icon && <Icon name={icon} size={32} />}
        {parent && (
            <>
                <InternalLink path={parent.path}>{parent.title}</InternalLink>
                <span className="separator">/</span>
            </>
        )}
        {title}
    </h1>
);
