import styled from "styled-components"
import colors from "../../utils/style/colors"
import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../../utils/context/AuthContext"
import { ErrorHandlingContext } from "../../utils/context/ErrorHandlingContext"


const AccountContainer = styled.div`
    padding: 10px;
    padding-top: 50px;
    padding-bottom: 50px;
    margin-bottom: 30px;
    min-height: 450px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 10px;
    position: relative;

    @media (max-width: 768px){
        padding-top: 0;
    }
`

const AccountWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;

    @media (max-width: 768px){
        align-items: center;
    }
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
`

const AccountList = styled.ul`
    display: flex;
    flex-direction: column;
`

const AccountInfo = styled.li`
    all: unset;
    padding: 10px;
`

const DeleteContainer = styled.div`
    padding: 15px;
    width: 100%;
`
const DeleteButtonContainer = styled.div`
    padding: 10px;
     @media (max-width: 768px){
        display: flex; 
        justify-content: center;
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

const DeleteInfoText = styled.p`
    color: ${colors.fourth};
    font-style: italic;
    padding: 10px;
    margin: 0;
`

const Account = ()=>{
    // Account's id from the params
    const {id} = useParams()
    // Authentification context containing token and account's id
    const {auth, logout} = useContext(AuthContext)
    // Store fetched account's data in state
    const [account, setAccount] = useState(null)
    // Error handling context
    const {errorMessage, ErrorMessage, setErrorMessage, successMessage, SuccessMessage, setSuccessMessage} = useContext(ErrorHandlingContext)


    /**
     * Every time the id changes, useEffect will run.
     * The id is the account's id contained in the url, 
     * so when myAccount button is clicked, the id will change,
     * triggering the useEffect anc fetching all account's data
     */
    useEffect(()=>{
        //Reset error/success message context
        setErrorMessage('')
        setSuccessMessage('')

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
                    setErrorMessage("An error occured when fetching account's data")
                    console.error(data.error)
                }

            }catch(error){
                setErrorMessage("An error occured when fetching account's data")
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
                console.log('Successfully deleted account', data)
                setSuccessMessage("Account successfully deleted!")
                setErrorMessage("") 

                await logout()
            } else {
                setErrorMessage("Failed to delete account")
                setSuccessMessage("") 
                console.error(data.error) 
            }
        } catch (error) {
            setErrorMessage("Failed to delete account")
            setSuccessMessage("") 
            console.error(error.message || error)
        }
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

                {errorMessage && <ErrorMessage/>}
                {successMessage && <SuccessMessage/>}

                <DeleteContainer>
                    <DeleteButtonContainer>
                        <DeleteButton onClick={handleDelete}>Delete Account</DeleteButton>
                    </DeleteButtonContainer>                
                    <DeleteInfoText>We inform you that all related posts are also removed upon account deletion</DeleteInfoText>
                </DeleteContainer>
                
            </AccountWrapper>
        </AccountContainer>
    )
}

export default Account
