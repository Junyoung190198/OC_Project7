import styled from "styled-components"
import SignupForm from "../../components/SignupForm"


const SignupContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 50px;
    padding-bottom: 30px;

    @media (max-width: 768px){
        padding-top: 20px;
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
