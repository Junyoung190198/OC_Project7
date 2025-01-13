import styled from "styled-components"
import colors from "../../utils/style/colors"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../utils/context/AuthContext"
import DarkModeToggle from "../DarkModeToggle"

const HeaderContainer = styled.div`
    border-bottom: solid 2px ${colors.secondary};
    width: 100%;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    @media (max-width: 768px){
        flex-direction: column;
    }
    @media (max-width: 480px){
        
    }
`
const HeaderNav = styled.nav`
    padding: 0 15px 0 15px;
    text-align: center;
    @media (max-width: 768px){
        width: 100%;    
    }
    @media (max-width: 480px){
        
    }
`
const HeaderList = styled.ul`
    padding: 0 20px 0 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;

    @media (max-width: 768px){
        
        flex-direction: column;
        gap: 10px;
        
    }
    @media (max-width: 480px){
        
    }
`
const HeaderListElement = styled(Link)`
    all: unset;
    padding: 15px;
    cursor: pointer;
    color: white;
    background-color: ${colors.primary};
    border-radius: 30px;
    &:hover{
        background-color: ${colors.fifth}
    }

    @media (max-width: 768px){        
        width: 180px;
    }
    @media (max-width: 480px){
        
    }
`
const HeaderTitle = styled.h1`
    color: ${colors.primary};
    padding-left: 30px;
`

const Header = ()=>{
    // Authentification context
    const {auth, logout} = useContext(AuthContext)

    return (
        <HeaderContainer>
            <HeaderTitle>Groupomania Socials</HeaderTitle>
            <HeaderNav>
                <HeaderList>
                    <HeaderListElement to='/'>Home</HeaderListElement>

                    {auth.token && (
                        <>
                        <HeaderListElement to={`/account/${auth._id}`}>My Account</HeaderListElement>
                        <DarkModeToggle />
                        </>
                        
                    )}

                    {auth.token ? (
                        <HeaderListElement as='button' onClick={logout}>Log Out</HeaderListElement>
                    ): (
                        <HeaderListElement to='/login'>Log In</HeaderListElement>
                    )}            
                </HeaderList>   
            </HeaderNav>
        </HeaderContainer>
    )
}


export default Header
