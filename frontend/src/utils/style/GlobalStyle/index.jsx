import {createGlobalStyle} from 'styled-components'
import React from 'react'
import { useContext } from 'react'
import { DarkModeContext } from '../../context/DarkModeContext'
const StyledGlobalStyle = createGlobalStyle`
    *{
        font-family: 'Trebuchet MS', Helvetica, sans-serif;
    }
    body{
        width: 100%;
        margin: 0;
        background-color: ${({ darkMode }) => (darkMode ? '#121212' : '#ffffff')};
        color: ${({ darkMode }) => (darkMode ? '#ffffff' : '#000000')};
        transition: all 0.3s ease;
    }
`

const GlobalStyle = () => {
    const { darkMode } = useContext(DarkModeContext)
    return <StyledGlobalStyle darkMode={darkMode} />
}

export default GlobalStyle
