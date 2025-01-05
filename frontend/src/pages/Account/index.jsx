import styled from "styled-components"
import colors from "../../utils/style/colors"
import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../../utils/context/AuthContext"


const AccountContainer = styled.div`
    padding: 10px;
    padding-top: 50px;
    padding-bottom: 50px;
    margin-bottom: 30px;
    display: flex;
    justifiy-content: flex-start;
    min-height: 450px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 10px;
    position: relative;

    @media (max-width: 768px){
        padding-top: 0;
    }

    @media (max-width: 480px){
        
    }
`

const AccountWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
`

const AccountTitle = styled.h2`
    color: ${colors.sixth};
    position: absolute;
    top: 10px;
    left: 50px;

    @media (max-width: 768px){
        position: relative;
        top: 0;
        left: 0;
        padding-bottom: 15px;
    }

    @media (max-width: 480px){
        
    }
`

const AccountList = styled.ul`
    display: flex;
    flex-direction: column;
`

const AccountInfo = styled.li`
    all: unset;
    padding: 10px;
`

const SignupLink = styled.p`
    color: ${colors.fourth};
    cursor: pointer;
   
    
    

    &:hover{
        color: ${colors.backgroundPrimary};
    }
`

const DeleteButton = styled.button`
    background-color: ${colors.primary};
    color: ${colors.sixth};
    border: none;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    border-radius: 30px;
    font-size: 16px;
    margin-top: 20px;

    &:hover {
        background-color: ${colors.fifth};
    }
`

const Account = ()=>{

    const {id} = useParams()
    const {auth} = useContext(AuthContext)
    const [account, setAccount] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(()=>{
        const fetchAccount = async()=>{
            try{
                const response = await fetch(`http://localhost:5000/groupomania/auth/account/${id}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({account_id: auth._id})
                })

                const data = await response.json()

                if(response.ok){
                    console.log('Successfully retrieved the account', data)
                    setAccount(data.account)
                }else{
                    console.error(data)
                }

            }catch(error){
                console.error(error.message || error)
            }
        }

        fetchAccount()
    }, [id])

    
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/groupomania/auth/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ account_id: auth._id })
            })

            const data = await response.json()

            if (response.ok) {
                console.log('Successfully logged out!', data)
                setSuccessMessage("Account successfully deleted!")
                setErrorMessage("") 
            } else {
                setErrorMessage(data.error || "Failed to delete account")
                setSuccessMessage("")  
            }
        } catch (error) {
            setErrorMessage("Internal server error")
            setSuccessMessage("") 
        }
    }

    if(!account){
        return <h2>Loading account info...</h2>
    }

    const {employee} = account || {}

    return (
        <AccountContainer>
            <AccountWrapper>
                <AccountTitle>Account Details</AccountTitle>
                <AccountList>   
                    <AccountInfo>First name: {employee?.FirstName}</AccountInfo>
                    <AccountInfo>Last Name: {employee?.LastName}</AccountInfo>
                    <AccountInfo>Address: {employee?.Address}</AccountInfo>
                    <AccountInfo>PhoneNumber: {employee?.PhoneNumber}</AccountInfo>
                    <AccountInfo>Email: {account?.Username}</AccountInfo>
                    <AccountInfo>Account's id: {account?._id}</AccountInfo>                    
                    <AccountInfo>Account created at: {account?.CreatedAt}</AccountInfo>
                </AccountList>

                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <DeleteButton onClick={handleDelete}>Delete Account</DeleteButton>
            </AccountWrapper>
        </AccountContainer>
    )
}

export default Account
