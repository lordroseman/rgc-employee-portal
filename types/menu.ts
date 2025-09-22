export type MenuItem = {
    label: string;
    icon?: string;
    items?: MenuItem[];
    open?: boolean;
    to?: string;
    onClick?: () => void;
}