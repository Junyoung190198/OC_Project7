import styled from "styled-components"
import colors from "../../utils/style/colors"
import { Link } from "react-router-dom"

const LoginFormWrapper = styled.div`
    padding: 10px;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    min-height: 500px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 10px;
    position: relative;
`
const LoginFormInput = styled.input`
    all: unset;
    background-color: ${colors.fourth};
    border-radius: 10px;
    color: white;
    padding: 10px;
    width: 50%;
    &::placeholder{
        color: white;
    }
`

const LoginFormTitle = styled.h2`
    color: ${colors.sixth};
    position: absolute;
    top: 10px;
    left: 50px;
`

const LoginSubmitButton = styled.button`
    all: unset;
    background-color: ${colors.primary};
    cursor: pointer;
    padding: 15px;
    border-radius: 30px;
    color: white;
    &:hover{
        background-color: ${colors.fifth};
    }
`

const SignupLink = styled(Link)`
    all: unset;
    color: ${colors.fourth};
    cursor: pointer;

    &:hover{
        color: ${colors.backgroundPrimary};
    }
`

const LoginForm = ()=>{
    return(
        <LoginFormWrapper>
            <LoginFormTitle>Log In</LoginFormTitle>
            <LoginFormInput placeholder="Email" type="email"/>
            <LoginFormInput placeholder="Password" type="password"/>
            <LoginSubmitButton>Submit</LoginSubmitButton>
            <SignupLink to='/signup'>New to Groupomania? Signup</SignupLink>
        </LoginFormWrapper>
    )   
}

export default LoginForm