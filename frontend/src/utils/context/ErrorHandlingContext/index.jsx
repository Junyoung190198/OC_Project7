import { createContext, useState } from "react";

export const ErrorHandlingContext = createContext()


export const ErrorHandlingProvider = ({children})=>{
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const ErrorMessage = ()=>{
        return (
            <p style={{color: 'red', padding: '10px'}}>{errorMessage}</p>
        )
    }

    const SuccessMessage = ()=>{
        return (
            <p style={{color: 'green', padding: '10px'}}>{successMessage}</p>
        )
    }
    

    return (
        <ErrorHandlingContext.Provider value={{errorMessage, ErrorMessage, setErrorMessage, successMessage, SuccessMessage, setSuccessMessage}}>
            {children}
        </ErrorHandlingContext.Provider>
    )
}
