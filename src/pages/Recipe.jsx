import { useEffect, useState } from 'react';
import './Recipe.css';
import { useParams } from 'react-router-dom';
import { API_KEY } from '../assets/API_KEY';
import { Button, Skeleton } from '@mui/material';

const Recipe = () => {
    const [details, setDetails] = useState();
    const [active, setActive] = useState('summary');
    const [loading, setLoading] = useState(true); // Added loading state
    const params = useParams();

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${params.name}/information?apiKey=${API_KEY}`
            );
            const detailsData = await response.json();
            console.log("API Response:", detailsData); // Log API data
            setDetails(detailsData);
        } catch (error) {
            console.error("Failed to fetch recipe details:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDetails();
    }, [params.name]);

    const handleClick = (status) => {
        setActive(status);
    };

    if (loading) {
        return (
            <div className="recipe-shimmer-container">
                <div className="recipe-shimmer-left">
                    <Skeleton variant="text" sx={{ fontSize: '3rem' }} animation="wave" />
                    <Skeleton variant="rectangular" animation="wave" height={300} width={500} />
                </div>
                <div className="recipe-shimmer-right">
                    <div className="btn-shimmer-right">
                        <Skeleton variant="rounded" animation="wave" height={35} width={120} />
                        <Skeleton variant="rounded" animation="wave" height={35} width={120} />
                        <Skeleton variant="rounded" animation="wave" height={35} width={120} />
                    </div>
                    <div className="shimmer-content-right">
                        <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} animation="wave" />
                        <div className="text-container-shimmer">
                            {[...Array(12)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant="text"
                                    sx={{ fontSize: '1.5rem' }}
                                    animation="wave"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-container-main">
            <h1>{details?.title || "No Title Available"}</h1>
            <div className="recipe-container">
                <div className="recipe-container-left">
                    <img src={details?.image} alt={details?.title || "Recipe"} className="recipe-imgs" />
                </div>
                <div className="recipe-container-right">
                    <div className="btn-container">
                        <Button
                            variant="contained"
                            onClick={() => handleClick('summary')}
                            disabled={active === 'summary'}
                        >
                            Summary
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleClick('ingredients')}
                            disabled={active === 'ingredients'}
                        >
                            Ingredients
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => handleClick('steps')}
                            disabled={active === 'steps'}
                        >
                            Steps
                        </Button>
                    </div>
                    {active === 'summary' && (
                        <div className="recipe-right-main">
                            <div className="summary">
                                <h2>Summary</h2>
                                <p dangerouslySetInnerHTML={{ __html: details?.summary || "No summary available." }}></p>
                            </div>
                            <div className="instructions">
                                <h2>Instructions</h2>
                                <p dangerouslySetInnerHTML={{ __html: details?.instructions || "No instructions available." }}></p>
                            </div>
                        </div>
                    )}
                    {active === 'ingredients' && (
                        Array.isArray(details?.extendedIngredients) ? (
                            details.extendedIngredients.map((data) => (
                                <div className="ingredient-bar" key={data?.id}>
                                    <h3 className="ingredients-h3">
                                        <p>{data?.name}</p>
                                        <p>{data?.amount} grams</p>
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <p>No ingredients available.</p>
                        )
                    )}
                    {active === 'steps' && (
                        Array.isArray(details?.analyzedInstructions?.[0]?.steps) ? (
                            details.analyzedInstructions[0].steps.map((data) => (
                                <div className="step" key={data?.number}>
                                    <h2>Step - {data?.number}</h2>
                                    <p>{data?.step}</p>
                                    <h4>
                                        Ingredients - {data?.ingredients?.[0]?.name || "No ingredients specified"}
                                    </h4>
                                </div>
                            ))
                        ) : (
                            <p>No steps available.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recipe;
