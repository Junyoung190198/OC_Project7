import styled from "styled-components"
import colors from "../../utils/style/colors"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const SignupFormWrapper = styled.form`
    padding: 10px;
    padding-top: 100px;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    min-height: 750px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 10px;
    position: relative;

    @media (max-width: 768px){
        padding-top: 50px;
    }

    @media (max-width: 480px){
        
    }

`
const SignupFormInput = styled.input`
    all: unset;
    background-color: ${colors.backgroundPrimary};
    border-radius: 10px;
    color: white;
    padding: 10px;
    width: 50%;
    max-width: 300px;

    border: ${(props) => (props.$error ? '2px solid red' : 'none')};

    &::placeholder{
        color: white;
    }
`

const SignupFormTitle = styled.h2`
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

const SignupSubmitButton = styled.button`
    all: unset;
    background-color: ${colors.primary};
    cursor: pointer;
    padding: 15px;
    border-radius: 30px;
    color: white;

    opacity: ${(props) => props.disabled ? '0.5' : '1'};

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
const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin: 5px 0 0 0;
`;

const SignupForm = ()=>{
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [dontAllowSubmit, setDontAllowSubmit] = useState(true);



    useEffect(()=>{
        const validationErrors = validateInputs()

        if(Object.keys(validationErrors).length === 0){
            setDontAllowSubmit(false)
            setErrors({})
        } else{
            setDontAllowSubmit(true)
        }

    }, [firstName, lastName, address, phoneNumber, email, password, confirmPassword])


    const validateInputs = () => {
        const newErrors = {}

       
        if (!firstName) {
            newErrors.firstName = "First Name is required."
        }

      
        if (!lastName) {
            newErrors.lastName = "Last Name is required."
        }

      
        if (!address) {
            newErrors.address = "Address is required."
        }

        
        if (!phoneNumber) {
            newErrors.phoneNumber = "Phone Number is required."
        } else if (!/^\d+$/.test(phoneNumber)) {
            newErrors.phoneNumber = "Phone Number must be only digits"
        }

  
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

        
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required."
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match."
        }
        return newErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateInputs()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            const response = await fetch('http://localhost:5000/groupomania/auth/signup', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    FirstName: firstName,
                    LastName: lastName,
                    Address: address,
                    PhoneNumber: phoneNumber,
                    Email: email,
                    Password: password
                })
            })

            const data = await response.json()

            if (response.ok) {
                console.log('Signup successful', data)

                setFirstName('');
                setLastName('');
                setAddress('');
                setPhoneNumber('');
                setEmail('');
                setPassword('');

                navigate('/login')
            } else {
                setErrors({ general: `${data.message}` || 'Signup failed' })
                console.error(data)
            }

        } catch (error) {
            console.error(error.message || error)
            setErrors({ general: 'An error occurred, please try again' })
        }
    }


    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
    }

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
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

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
        const newErrors = validateInputs();
        setErrors(newErrors);  
    }

    return(
        <SignupFormWrapper onSubmit={handleSubmit}>
            <SignupFormTitle>Sign Up</SignupFormTitle>

            <SignupFormInput placeholder="First Name" type="text" value={firstName} onChange={handleFirstNameChange} $error={!!errors.firstName}/>
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}

            <SignupFormInput placeholder="Last Name" type="text" value={lastName} onChange={handleLastNameChange} $error={!!errors.lastName}/>
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}

            <SignupFormInput placeholder="Address" type="text" value={address} onChange={handleAddressChange} $error={!!errors.address}/>
            {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}

            <SignupFormInput placeholder="Phone Number" type="text" value={phoneNumber} onChange={handlePhoneNumberChange} $error={!!errors.phoneNumber}/>
            {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}

            <SignupFormInput placeholder="Email" type="email" value={email} onChange={handleEmailChange} $error={!!errors.email}/>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

            <SignupFormInput placeholder="Create your pasword" type="password" onChange={handlePasswordChange} value={password} $error={!!errors.password}/>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

            <SignupFormInput placeholder="Confirm your password" type="password" onChange={handleConfirmPasswordChange} value={confirmPassword} $error={!!errors.confirmPassword}/>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}            

            {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}

            <SignupSubmitButton type="submit" disabled={dontAllowSubmit}>Submit</SignupSubmitButton>

            <SignupLink to='/login'>Already signed in? Login</SignupLink>
        </SignupFormWrapper>
    )   
}

export default SignupForm

