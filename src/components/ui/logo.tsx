import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("relative aspect-3/1", className)}>
            <Image
                src="/oricraft-logo.png"
                alt="Orí Craft Labs Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
