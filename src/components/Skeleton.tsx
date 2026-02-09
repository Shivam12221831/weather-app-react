export const Skeleton = () => {
    return (
        <div className="w-full h-full overflow-hidden rounded-md border border-gray-600 p-4 sm:p-6 flex flex-col justify-between">
        
            <div className="flex animate-pulse gap-4">
                <div className="size-10 rounded-full bg-gray-300 shrink-0"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-3 rounded bg-gray-300 w-1/2"></div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 h-3 rounded bg-gray-300"></div>
                        <div className="col-span-1 h-3 rounded bg-gray-300"></div>
                    </div>
                    <div className="h-3 rounded bg-gray-300 w-3/4"></div>
                </div>
            </div>

            <div className="flex animate-pulse gap-4 mt-6">
                <div className="size-10 rounded-full bg-gray-300 shrink-0"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-3 rounded bg-gray-300 w-1/2"></div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 h-3 rounded bg-gray-300"></div>
                        <div className="col-span-1 h-3 rounded bg-gray-300"></div>
                    </div>
                    <div className="h-3 rounded bg-gray-300 w-2/3"></div>
                </div>
            </div>

            <div className="flex animate-pulse gap-4 mt-6">
                <div className="size-10 rounded-full bg-gray-300 shrink-0"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-3 rounded bg-gray-300 w-1/2"></div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 h-3 rounded bg-gray-300"></div>
                        <div className="col-span-1 h-3 rounded bg-gray-300"></div>
                    </div>
                    <div className="h-3 rounded bg-gray-300 w-2/3"></div>
                </div>
            </div>

            <div className="flex animate-pulse gap-4 mt-6">
                <div className="size-10 rounded-full bg-gray-300 shrink-0"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-3 rounded bg-gray-300 w-1/2"></div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 h-3 rounded bg-gray-300"></div>
                        <div className="col-span-1 h-3 rounded bg-gray-300"></div>
                    </div>
                    <div className="h-3 rounded bg-gray-300 w-2/3"></div>
                </div>
            </div>

        </div>
    );
};