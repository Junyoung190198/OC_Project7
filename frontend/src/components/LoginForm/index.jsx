import styled from "styled-components"
import colors from "../../utils/style/colors"
import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../utils/context/AuthContext"

const LoginFormWrapper = styled.form`
    padding: 10px;
    padding-top: 50px;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
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
const LoginFormInput = styled.input`
    all: unset;
    background-color: ${colors.backgroundPrimary};
    border-radius: 10px;
    color: white;
    padding: 10px;
    width: 50%;
    max-width: 300px; 

    border: ${(props)=> (props.$error ? '2px solid red' : 'none')};

    &::placeholder{
        color: white;
    }
`

const LoginFormTitle = styled.h2`
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

const LoginSubmitButton = styled.button`
    all: unset;
    background-color: ${colors.primary};
    cursor: pointer;
    padding: 15px;
    border-radius: 30px;
    color: white;

    opacity: ${(props)=> props.disabled ? '0.5' : '1'};

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

const ErrorMessage = styled.span`
    color: red;
    font-size: 0.9rem;
    margin: 5px 0 0 0;
`

const LoginForm = ()=>{
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [DontallowSubmit, setDontAllowSubmit] = useState(true)

    const {setAuth} = useContext(AuthContext)

    useEffect(()=>{
        const validationErrors = validateInputs()

        if(Object.keys(validationErrors).length === 0){
            setDontAllowSubmit(false)
            setErrors({})
        } else{
            setDontAllowSubmit(true)
        }


    }, [email, password])

    const validateInputs = () => {
        const newErrors = {}

        if (!email) {
            newErrors.email = "Email is required."
            
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = "Invalid email format."   
        }

        if (!password) {
            newErrors.password = "Password is required."
            
        } else if (password.length < 2) {
            newErrors.password = "Password must be at least 2 characters."
            
        } 

        return newErrors;
    }


    const handleSubmit = async (e)=>{
        e.preventDefault()

        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try{
            const response = await fetch('http://localhost:5000/groupomania/auth/login', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({Email: email, Password: password})
            })
            
            const data = await response.json()

            if(response.ok){
                console.log('Login successfull', data)

                const {token, _id} = data
                setAuth({token, _id})

                setEmail('')
                setPassword('')

                navigate('/')
                console.log(document.cookie); // Check if the cookie is in the document

            } else{
                setErrors({general: data.error || 'Login failed'})   
                console.error(data)
            }

        }catch(error){
            console.error(error.message || error)
            setErrors({general: 'An error occured, please try again'})
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
    }


    return(
        <LoginFormWrapper onSubmit={handleSubmit}>
            <LoginFormTitle>Log In</LoginFormTitle>

            <LoginFormInput placeholder="Email" type="email" value={email} onChange={handleEmailChange} $error={!!errors.email}/> 
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

            <LoginFormInput placeholder="Password" type="password" value={password} onChange={handlePasswordChange} $error={!!errors.password}/>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

            {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}

            <LoginSubmitButton type="submit" disabled={DontallowSubmit}>Submit</LoginSubmitButton>

            <SignupLink to='/signup'>New to Groupomania? Signup</SignupLink>
        </LoginFormWrapper>
    )   
}

export default LoginForm