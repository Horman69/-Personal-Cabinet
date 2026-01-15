/**
 * Design Tokens: Border Radius
 * Consistent rounding scale
 */

export const radius = {
    none: '0',
    sm: '0.25rem',    // 4px - inputs, badges
    md: '0.375rem',   // 6px - buttons, cards (default)
    lg: '0.5rem',     // 8px - modals, dropdowns
    xl: '0.75rem',    // 12px - hero cards
    '2xl': '1rem',    // 16px - images
    '3xl': '1.5rem',  // 24px - special elements
    full: '9999px',   // pills, avatars
} as const;
