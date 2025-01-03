import { createContext, useState } from "react";

export const ErrorContext = createContext()

export const ErrorProvider = ({children})=>{
    const [error, setError] = useState(null)

    return (
        <ErrorContext.Provider value={{error, setError}}>
            {children}
        </ErrorContext.Provider>
    )
}


export const LoaderContext = createContext()

export const LoaderProvider = ({children})=>{
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <LoaderContext.Provider value={{isLoaded, setIsLoaded}}>
            {children}
        </LoaderContext.Provider>
    )
}

