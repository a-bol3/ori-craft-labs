"use client";

export function StickyBg() {
    return (
        <div className="fixed inset-0 -z-50 h-full w-full bg-brand">
            {/* Placeholder for background image. 
            User can replace this with an Image component later.
            Currently using brand color: #23001E 
        */}
            <div className="absolute inset-0 bg-linear-to-br from-brand via-brand to-black opacity-80" />
        </div>
    );
}
