import styled from "styled-components"
import SignupForm from "../../components/SignupForm"


const SignupContainer = styled.div`
    padding-top: 10%;
    margin-right: 15%;
    margin-left: 15%;

    @media (max-width: 768px){
        margin-right: 40px;
        margin-left: 40px;
    }
    @media (max-width: 480px){
        margin-right: 20px;
        margin-left: 20px;
    }
`

const Signup =()=>{
    return (    
        <SignupContainer>
                <SignupForm/>            
        </SignupContainer>
    )
}

export default Signup
