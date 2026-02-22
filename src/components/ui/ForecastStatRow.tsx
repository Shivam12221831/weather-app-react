export const StatRow = ({ icon, value, }: { icon: React.ReactNode; value: string | number;}) => (
    <div className="flex items-center gap-5">
        <span className="flex items-center justify-center w-4 h-4 shrink-0 text-sm md:text-md">{icon}</span>
        <span className="text-xs sm:text-sm font-medium">{value}</span>
    </div>
);