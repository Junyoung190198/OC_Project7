import React, { useContext } from 'react'
import { DarkModeContext } from '../../utils/context/DarkModeContext'
import styled from 'styled-components'
import colors from '../../utils/style/colors'

const DarkModeButton = styled.button`
    all: unset;
    padding: 15px;
    cursor: pointer;
    color: white;
    background-color: ${colors.primary};
    border-radius: 30px;
    &:hover{
        background-color: ${colors.fifth}
    }

    @media (max-width: 768px){        
        width: 180px;
    }
    @media (max-width: 480px){
        
    }
`

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

  return (
    <DarkModeButton onClick={toggleDarkMode}>
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </DarkModeButton>
  )
}

export default DarkModeToggle

