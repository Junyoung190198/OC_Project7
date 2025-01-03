import styled from "styled-components"
import colors from "../../utils/style/colors"
import { Link } from "react-router-dom"

const SignupFormWrapper = styled.div`
    padding: 10px;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    min-height: 750px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 10px;
    position: relative;
`
const SignupFormInput = styled.input`
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

const SignupFormTitle = styled.h2`
    color: ${colors.sixth};
    position: absolute;
    top: 10px;
    left: 50px;
`

const SignupSubmitButton = styled.button`
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



const SignupForm = ()=>{
    return(
        <SignupFormWrapper>
            <SignupFormTitle>Sign Up</SignupFormTitle>
            <SignupFormInput placeholder="First Name" type="text"/>
            <SignupFormInput placeholder="Last Name" type="text"/>
            <SignupFormInput placeholder="Address" type="text"/>
            <SignupFormInput placeholder="Phone Number" type="text"/>
            <SignupFormInput placeholder="Email" type="email"/>
            <SignupSubmitButton>Submit</SignupSubmitButton>
            <SignupLink to='/login'>Already signed in? Login</SignupLink>
        </SignupFormWrapper>
    )   
}

export default SignupForm

