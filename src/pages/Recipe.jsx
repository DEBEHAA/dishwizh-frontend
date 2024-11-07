import { useEffect, useState } from 'react';
import './Recipe.css';
import { useParams } from 'react-router-dom';
import { Button, Skeleton, Typography } from '@mui/material';

const Recipe = () => {
    const [details, setDetails] = useState(null); // Recipe details state
    const [active, setActive] = useState('summary'); // Active tab state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state
    const params = useParams();

    const API_KEY = process.env.REACT_APP_API_KEY || '81bdc134fb73435fbb14311ed16cb557'; // Use environment variable

    const fetchDetails = async () => {
        setLoading(true);
        setError(''); // Reset error state
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${params.name}/information?apiKey=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const detailsData = await response.json();
            console.log("API Response:", detailsData); // Log API data
            setDetails(detailsData);
        } catch (err) {
            console.error("Failed to fetch recipe details:", err);
            setError('Failed to load recipe details. Please try again later.');
        } finally {
            setLoading(false);
        }
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
                        {[...Array(3)].map((_, index) => (
                            <Skeleton key={index} variant="rounded" animation="wave" height={35} width={120} />
                        ))}
                    </div>
                    <div className="shimmer-content-right">
                        <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} animation="wave" />
                        {[...Array(12)].map((_, index) => (
                            <Skeleton key={index} variant="text" sx={{ fontSize: '1.5rem' }} animation="wave" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    if (!details) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No recipe details found.
            </Typography>
        );
    }

    return (
        <div className="recipe-container-main">
            <Typography variant="h4" align="center" gutterBottom>
                {details?.title || "No Title Available"}
            </Typography>
            <div className="recipe-container">
                <div className="recipe-container-left">
                    <img
                        src={details?.image || 'https://via.placeholder.com/500'}
                        alt={details?.title || "Recipe"}
                        className="recipe-imgs"
                    />
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
                                <Typography variant="h6">Summary</Typography>
                                <Typography
                                    dangerouslySetInnerHTML={{
                                        __html: details?.summary || "No summary available.",
                                    }}
                                ></Typography>
                            </div>
                            <div className="instructions">
                                <Typography variant="h6">Instructions</Typography>
                                <Typography
                                    dangerouslySetInnerHTML={{
                                        __html: details?.instructions || "No instructions available.",
                                    }}
                                ></Typography>
                            </div>
                        </div>
                    )}
                    {active === 'ingredients' && (
                        Array.isArray(details?.extendedIngredients) ? (
                            details.extendedIngredients.map((data) => (
                                <div className="ingredient-bar" key={data?.id}>
                                    <Typography variant="body1">
                                        {data?.name}: {data?.amount} {data?.unit}
                                    </Typography>
                                </div>
                            ))
                        ) : (
                            <Typography>No ingredients available.</Typography>
                        )
                    )}
                    {active === 'steps' && (
                        Array.isArray(details?.analyzedInstructions?.[0]?.steps) ? (
                            details.analyzedInstructions[0].steps.map((data) => (
                                <div className="step" key={data?.number}>
                                    <Typography variant="h6">Step {data?.number}</Typography>
                                    <Typography>{data?.step}</Typography>
                                    <Typography variant="body2">
                                        Ingredients: {data?.ingredients?.[0]?.name || "No ingredients specified"}
                                    </Typography>
                                </div>
                            ))
                        ) : (
                            <Typography>No steps available.</Typography>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recipe;
