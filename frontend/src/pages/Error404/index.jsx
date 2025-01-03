import styled from "styled-components"

const ErrorMessage404 = styled.h1`
    text-align: center;
`

const Error404 = ()=>{
    return (
        <ErrorMessage404>
            Oops, couldn't find the page you are looking for!
        </ErrorMessage404>
    )
}

export default Error404
