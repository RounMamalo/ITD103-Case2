import {dashboard, expenses, transactions, trend, stocks} from '../utils/Icons'

export const menuItems = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "View Data",
        icon: transactions,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Reports",
        icon: stocks,
        link: "/dashboard",
    },
]
