import styled, {keyframes} from 'styled-components'
import colors from '../colors'


const rotate = keyframes`
    from{
        transform: rotate(0deg);
    }to{
        transform: rotate(360deg);
    }
`

const Loader = styled.div`
    padding: 30px;
    border: 15px solid ${colors.primary};
    border-radius: 50%;
    border-bottom-color: transparent;
    animation: ${rotate} 1s infinite linear;
    height: 0px;
    width: 0px;
`

export default Loader
