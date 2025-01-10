import { createContext, useState } from "react";

export const ErrorHandlingContext = createContext()


export const ErrorHandlingProvider = ({children})=>{
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const ErrorMessage = ()=>{
        return (
            <p style={{color: 'red'}}>{errorMessage}</p>
        )
    }

    const SuccessMessage = ()=>{
        return (
            <p style={{color: 'green'}}>{successMessage}</p>
        )
    }
    

    return (
        <ErrorHandlingContext.Provider value={{errorMessage, ErrorMessage, setErrorMessage, successMessage, SuccessMessage, setSuccessMessage}}>
            {children}
        </ErrorHandlingContext.Provider>
    )
}
