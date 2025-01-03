import styled from "styled-components"
import colors from "../../utils/style/colors"

const PostWrapper = styled.div`
    padding: 10px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 15px;

`
const PostTitle = styled.h2`
    padding-left: 10px;
`
const PostContent = styled.p`
    padding: 10px;
`
const CreatedAt = styled.span`
    text-style: italic;
`

const Post = ({postTitle, postContent, createdAt})=>{
    return (
        <PostWrapper>
            <PostTitle>{postTitle}</PostTitle>
            <PostContent>{postContent}</PostContent>
            <CreatedAt>{createdAt}</CreatedAt>
        </PostWrapper>
    
    )
}

export default Post
