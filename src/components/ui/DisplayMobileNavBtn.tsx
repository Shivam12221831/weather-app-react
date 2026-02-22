import type { DisplayMobileNavBtnProps } from "@/types/ui/displayMobileNavBtnProps";

export const MobileNavBtn = ({ onClick, icon, suffix, children }: DisplayMobileNavBtnProps) => {
    return (
        <button onClick={onClick} className="relative w-full max-w-sm flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-white/75 hover:text-white text-sm font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
            {icon}
            {children}
            {suffix}
        </button>
    );
}