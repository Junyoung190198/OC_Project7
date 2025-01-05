import styled from "styled-components"
import colors from "../../utils/style/colors"

const ContentWrapper = styled.div`
    padding: 10px;
    padding-top: 0;
    border-radius: 15px; 
    
`

const PostTitle = styled.h2`
    text-align: center; 
`
const PostContent = styled.p`
    padding: 10px;
`
const CreatedAt = styled.span`
    font-style: italic;
`
const CreatedAtWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`



const Post = ({postTitle, postContent, createdAt, _id})=>{
    return (
        <ContentWrapper>
            <PostTitle>{postTitle}</PostTitle>
            <PostContent>{postContent}</PostContent>

            <CreatedAtWrapper>
                <CreatedAt>{createdAt}</CreatedAt>
            </CreatedAtWrapper>
        </ContentWrapper>
    )
}

export default Post
