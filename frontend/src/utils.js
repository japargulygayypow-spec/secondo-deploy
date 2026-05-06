import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function createPageUrl(path) {
    return path.startsWith('/') ? path : `/${path}`;
}

export function getCategoryIds(categories, rootId) {
    if (!categories || !rootId) return new Set();

    const ids = new Set();
    // Add root ID if desired, usually yes
    // But if root is "Men", we want all subcats too.
    // The products might be assigned to subcats OR root. So include root.
    ids.add(rootId);

    const children = categories.filter(c => c.parent === rootId);
    children.forEach(child => {
        ids.add(child.id);
        const descendants = getCategoryIds(categories, child.id);
        descendants.forEach(d => ids.add(d));
    });

    return ids;
}
