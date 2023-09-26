import React from 'react';
import { icons, LucideProps } from 'lucide-react';

export interface IconProps extends LucideProps {
    name: string,
}

export const Icon = ({ name, ...props }: IconProps) => {
    // @ts-ignore
    const LucideIcon = icons[capitalize(name)];

    // eslint-disable-next-line react/jsx-props-no-spreading,react/jsx-no-useless-fragment
    return LucideIcon ? <LucideIcon {...props} /> : <></>;
};

const camelize = (s: string) => s.replace(/-./g, (ss) => ss[1].toUpperCase());
const capitalize = (s: string) => s[0].toUpperCase() + camelize(s).slice(1);
