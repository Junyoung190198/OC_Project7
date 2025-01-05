import {createGlobalStyle} from 'styled-components'

const StyledGlobalStyle = createGlobalStyle`
    *{
        font-family: 'Trebuchet MS', Helvetica, sans-serif;
    }
    body{
        width: 100%;
        margin: 0;
    }
`

const GlobalStyle = ()=>{
    return <StyledGlobalStyle/>
}

export default GlobalStyle
