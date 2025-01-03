import styled from "styled-components"
import LoginForm from "../../components/LoginForm"


const LoginContainer = styled.div`
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

const Login =()=>{
    return (    
        <LoginContainer>
                <LoginForm/>            
        </LoginContainer>
    )
}

export default Login
