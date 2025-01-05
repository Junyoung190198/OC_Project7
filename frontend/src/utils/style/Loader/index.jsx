import styled, {keyframes} from 'styled-components'
import colors from '../colors'


const rotate = keyframes`
    from{
        transform: rotate(0deg);
    }to{
        transform: rotate(360deg);
    }
`

const LoaderContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const LoaderAnim = styled.div`
    padding: 30px;
    border: 15px solid ${colors.primary};
    border-radius: 50%;
    border-bottom-color: transparent;
    animation: ${rotate} 1s infinite linear;
    height: 0px;
    width: 0px;
`
const Loader = ()=>{
    return (
        <LoaderContainer>
            <LoaderAnim/>
        </LoaderContainer>
    )
}

export default Loader
