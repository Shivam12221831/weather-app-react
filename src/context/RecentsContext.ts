import type { RecentsContextType } from "@/types/recentsType";
import { createContext } from "react";

export const RecentsContext = createContext<RecentsContextType | null>(null);