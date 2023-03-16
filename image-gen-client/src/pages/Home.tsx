import { ChangeEvent, useEffect, useState } from "react";
import { Loader, Card, FormField } from "../components";

interface RenderProps {
    data: Array<{
        _id: number;
        name: string;
        prompt: string;
        photo: string;
    }>;
    title: string;
}

const RenderCards = ({ data, title }:RenderProps) => {
    if (data?.length > 0) {
        return <>{data.map((post) => <Card key={post._id} {...post} />)}</>
    }
    return (
        <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
    )
}

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState<{
        _id: number;
        name: string;
        photo: string;
        prompt: string;
    }[]>([]);
    const [searchResults, setSearchResults] = useState<{
        _id: number;
        name: string;
        photo: string;
        prompt: string;
    }[]>([]);
    const [searchTimeout, setSearchTimeout] = useState<any>();
    
    const [searchText, setSearchText] = useState("");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        clearTimeout(searchTimeout);

        setSearchText(event.target.value);

        setSearchTimeout(
            setTimeout(() => {
                const searchData = allPosts.filter((post) => post.name.toLowerCase().includes(searchText.toLocaleLowerCase()) || post.prompt.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
                setSearchResults(searchData);
            }, 500)
        );
    }
    
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://image-gen-42fz.onrender.com/api/v1/post", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    const result = await response.json();
                    setAllPosts(result.data.reverse());
                }
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, [])

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Experience the Magic of Words Into Art</h1>
                <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
                Explore stunning images crafted by AI. Immerse yourself in a world of breathtaking visuals, from mesmerizing abstract patterns to creative landscapes and beyond.
                </p>
            </div>     
            <div className="mt-16">
                <FormField labelName="Search through community post" type="text" name="homeSearch" placeholder="Type user name or post prompt" value={searchText} handleChange={handleChange}  />
            </div>
            <div className="mt-10">
                { loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                    ) : (
                        <>
                        {searchText && (
                            <h2 className="font-medium text-[#666e75] text-xl mb-3">
                            Showing results for <span className="text-[#222328]">{searchText}</span>
                            </h2>
                        )}
                        <div className="grid lg:grid-cols-4 sm:grid-col-3 xs:grid-cols-2 grid-col-1 gap-3">
                            {searchText ? (
                                <RenderCards data={searchResults} title="No search results found" />
                            ) : (
                                <RenderCards data={allPosts} title="No posts found" />
                            )}
                        </div>
                        </>
                    )
                }
            </div>
        </section>
    );
};

export default Home;