import { useState, useEffect, useContext } from "react"
import { ErrorContext } from "../../utils/context"
import { LoaderContext } from "../../utils/context"
import Loader from "../../utils/style/Loader"
import styled from "styled-components"
import Post from "../../components/Post"


const PostContainer = styled.div`
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin: 0 auto;
`

const Home = ()=>{

    // State to store fetched data
    const [postData, setPostData] = useState([])
    // Getting error context data from context
    const {error, setError} = useContext(ErrorContext)
    // Getting loader context
    const {isLoaded, setIsLoaded} = useContext(LoaderContext)
    

    useEffect(()=>{
        const fetchPosts = async ()=>{
            try{
                const response = await fetch('http://localhost:5000/groupomania/posts')
                const data = await response.json()
                setPostData(data.posts)
                setIsLoaded(true)
            }catch(error){
                console.log(error)
                setError(error.message)
            }
        }   

        fetchPosts()
    }, [])


    return (
        <PostContainer>  
            {error ? (<h2>Something went wrong: {error}</h2>)
            : (
                isLoaded ? (    
                postData.map((post)=>{
                    return (
                        <Post key={post._id}
                        postTitle={post.PostTitle}
                        postContent={post.PostContent}
                        createdAt={post.CreatedAt}
                        />
                    )
                }) 
                ): (
                    <Loader/>
                )
            )     
        } 
        </PostContainer>
    )
}


export default Home
