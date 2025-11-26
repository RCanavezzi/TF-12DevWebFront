
export type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    classList?: string;
}

export type ButtonRef = {
    disable: () => void;
    enable: () => void;
}