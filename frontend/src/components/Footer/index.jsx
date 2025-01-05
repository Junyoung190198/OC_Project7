import styled from "styled-components";
import colors from "../../utils/style/colors";
import { Link } from "react-router-dom";

const FooterLayout = styled.footer`
    width: 100%;
    padding-bottom: 100px;
    padding-top: 20px;        
    background-color: ${colors.backgroundPrimary};
    position: relative;

    @media (max-width: 768px){
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 480px){
        padding-right: 0;
        padding-left: 0; 
    }
`
const FooterTitle = styled.h2`
    padding-left: 20px;
    color: ${colors.primary};
`

const FooterList = styled.nav`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: center;

`
const FooterListWrapper = styled.div`
    display: flex;
    justify-content: center;
`

const FooterListElementAnchor = styled.a`
    all: unset;
    color: white;
    cursor: pointer;
        
    &:hover{
        opacity: 0.5;
    }
`
const FooterListElementLink = styled(Link)`
    all: unset;
    color: white;
    cursor: pointer;
        
    &:hover{
        opacity: 0.5;
    }
`

const FooterCopyright = styled.p`
    font-size: 10px;
    font-weight: 300;
    color: white;
    position: absolute;
    bottom: 10px;
    right: 20px;
    opacity: 0.8;
`

const Footer =  ()=>{
    return (
        <FooterLayout>
            <FooterTitle>Groupomania Socials</FooterTitle>
            
            <FooterListWrapper>
                <FooterList>
                    <FooterListElementAnchor href="mailto:groupomania_contact_us@gmail.com">
                        Contact us?
                    </FooterListElementAnchor>
                    <FooterListElementLink to='/'>
                        Delete my account
                    </FooterListElementLink>
                </FooterList>
            </FooterListWrapper>
            
            <FooterCopyright>Copyright 2025 Groupomania, Inc. All rights reserved.</FooterCopyright>
        </FooterLayout>
    )
}

export default Footer
