import SidebarNavItem from './SidebarNavItem';

export default function SidebarNavGroup({ group, onNavigate }) {
    return (
        <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.label}
            </p>
            <ul className="space-y-1">
                {group.items.map((item) => (
                    <li key={item.key}>
                        <SidebarNavItem
                            item={item}
                            isActive={
                                item.route !== null &&
                                route().current(item.route)
                            }
                            onNavigate={onNavigate}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
