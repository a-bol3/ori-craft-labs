import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface InfoCardProps {
    title: string;
    description: string;
    category?: string;
    link?: string;
    className?: string;
    backgroundImage?: string;
}

export function InfoCard({ title, description, category, link, className, backgroundImage }: InfoCardProps) {
    return (
        <div className={cn("w-[280px] md:w-[350px] shrink-0 bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col items-start gap-4 relative overflow-hidden group", className)}>
            {backgroundImage && (
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <Image
                        src={backgroundImage}
                        alt=""
                        fill
                        className="object-cover opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    {/* Overlay to ensure text readability when image is fully visible */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                </div>
            )}

            <div className="relative z-10 flex flex-col items-start gap-4 h-full w-full">
                {category && (
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary font-heading">
                        {category}
                    </span>
                )}
                <h3 className="text-xl font-bold text-white font-heading">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed font-body">
                    {description}
                </p>
                {link && (
                    <Link
                        href={link}
                        className="mt-aut text-cta font-bold text-sm uppercase tracking-wider hover:underline font-heading"
                    >
                        Więcej
                    </Link>
                )}
            </div>
        </div>
    );
}
