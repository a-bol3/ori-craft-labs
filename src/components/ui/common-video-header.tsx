import React from "react";

export default function CommonVideoHeader() {
    return (
        <div className="absolute top-0 left-0 w-full h-[550px] z-0 overflow-hidden pointer-events-none">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60"
                src="https://cdn.pixabay.com/video/2023/10/22/186115-877653483_tiny.mp4"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Gradient blend to page content */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-linear-to-t from-brand to-transparent" />
        </div>
    );
}
