import { useState, useEffect, useContext } from "react"
import { ErrorContext } from "../../utils/context/ErrorContext"
import { LoaderContext } from "../../utils/context/LoaderContext"
import Loader from "../../utils/style/Loader"
import styled from "styled-components"
import Post from "../../components/Post"
import colors from "../../utils/style/colors"
import Image from "../../components/Image"

const PostContainerLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 768px){
        padding-right: 10px;
        padding-left: 10px;    
    
        
    }
    @media (max-width: 480px){
        padding-right: 0;
        padding-left: 0; 
    }
`

const PostContainer = styled.div`
    padding: 20px;
    padding-right: 30px;
    padding-left: 30px;
    margin-bottom: 15px;
    border-radius: 10px;
    width: 60%;
     @media (max-width: 768px){
        width: 80%;       
    }
    @media (max-width: 480px){
        
    } 
`
const GreyLine = styled.div`
    height: 2px;
    background-color: ${colors.primary}; 
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
                if(!response.ok){   
                    throw new Error(`Error fetching data ${response.status}`)
                }
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
        <PostContainerLayout>  
            {error ? (<h2>Something went wrong: {error}</h2>)
            : (                
                isLoaded ? (    
                postData.map((post)=>{
                    console.log(post.media)

                    return (
                        <PostContainer key={post._id}>

                            <Image medias={post.media}/>

                            <Post _id={post._id}
                            postTitle={post.PostTitle}
                            postContent={post.PostContent}
                            createdAt={post.CreatedAt}
                            />

                            <GreyLine/>
                        </PostContainer>                        
                    )
                })                 
                ): (
                    <Loader/>     
                )
            )     
        } 
        </PostContainerLayout>
    )
}

export default Home
