import styled from "styled-components"
import LoginForm from "../../components/LoginForm"


const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    padding-top: 50px;

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

const Login =()=>{
    return (    
        <LoginContainer>
                <LoginForm/>            
        </LoginContainer>
    )
}

export default Login
