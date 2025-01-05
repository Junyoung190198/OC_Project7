import { createContext, useState } from "react";

export const LoaderContext = createContext()

export const LoaderProvider = ({children})=>{
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <LoaderContext.Provider value={{isLoaded, setIsLoaded}}>
            {children}
        </LoaderContext.Provider>
    )
}
