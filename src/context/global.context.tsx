import { createContext, useContext, useState, type ReactNode } from "react";
interface GlobalContextType {
    value: number
    setValue: React.Dispatch<React.SetStateAction<number>>
}
export const EmptyGlobalState: number = 0
export const GlobalContext = createContext<GlobalContextType>({
    value: 0,
    setValue: () => { }
})
interface GloblaProps {
    children: ReactNode
}

export const GlobalProvider = ({ children }: GloblaProps) => {
    const [value, setValue] = useState<number>(0)

    return (
        <GlobalContext.Provider value={{ value, setValue }}>
            {children}
        </GlobalContext.Provider>
    )
}


export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if (context.value === 0) throw new Error("Error global context")
    return context
}