import type { CurrentInfoRowProps } from "@/types/ui/currentInfoRowProps";

export const InfoRow = ({ icon, label, value, isDark }: CurrentInfoRowProps) => {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${ isDark ? "bg-[#334155]" : "bg-blue-200" }`}>
            <span className="flex items-center justify-center w-6 h-6 shrink-0 text-inherit">{icon}</span>
            <span className={`text-sm shrink-0 w-23 ${isDark ? "text-slate-400" : "text-blue-700"}`}>{label}</span>
            <span className="text-sm font-semibold ml-auto text-right">{value}</span>
        </div>
    )
};