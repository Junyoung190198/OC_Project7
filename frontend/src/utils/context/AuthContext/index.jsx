import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({
        token: null,
        _id: null
    })


    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const response = await fetch('http://localhost:5000/groupomania/auth/refresh', {
                    method: 'POST',
                    credentials: 'include'  
                });
    
                if (response.ok) {
                    const data = await response.json()
                    setAuth(prevState => ({
                        ...prevState,
                        token: data.token
                    }));
                    console.log("Access token refreshed successfully", data)

                } else {
                    console.error("Failed to refresh access token")
                }
            } catch (error) {
                console.error("Error while refreshing access token:", error)
            }
        };

        if (auth.token) {
            const intervalId = setInterval(() => {
                refreshAccessToken()
            }, 2 * 24 * 60 * 60); 

            
            return () => clearInterval(intervalId);
        }
    }, [auth.token]);


    const logout = async()=>{
        try{
            const response = await fetch('http://localhost:5000/groupomania/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            if(response.ok){
                setAuth({token: null, _id: null})
                console.log(`Successfully logged out. Status: ${response.status}`)
                
            }else{
                console.error(response.status)
            }

        }catch(error){
            console.error(error.message || error)
        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
