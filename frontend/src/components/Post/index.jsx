import styled from "styled-components"
import { Link } from "react-router-dom"

const ContentWrapper = styled(Link)`
    all: unset;
    padding: 10px;
    padding-top: 0;
    border-radius: 15px; 
    cursor: pointer;
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
        <ContentWrapper to={`/post/${_id}`}>
            <PostTitle>{postTitle}</PostTitle>
            <PostContent>{postContent}</PostContent>

            <CreatedAtWrapper>
                <CreatedAt>{createdAt}</CreatedAt>
            </CreatedAtWrapper>
        </ContentWrapper>
    )
}

export default Post
