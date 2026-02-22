import type { DisplayNavBtnProps } from "@/types/ui/displayNavBtnProps";

export const NavBtn = ({ onClick, icon, children }: DisplayNavBtnProps) => {
    return (
        <button onClick={onClick} className="group relative h-12 px-4 flex items-center gap-2 text-sm font-serif font-medium cursor-pointer text-white/65 hover:text-white transition-colors duration-200">
            {icon}
            {children}
        </button>
    );
}