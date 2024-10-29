import React from 'react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const FavoriteIcon = ({ isFavorite, onToggle }) => {
    return (
        <div onClick={onToggle} style={{ cursor: 'pointer' }}>
            {isFavorite ? (
                <Favorite style={{ color: 'red', fontSize: '24px' }} />
            ) : (
                <FavoriteBorder style={{ color: 'white', fontSize: '24px' }} />
            )}
        </div>
    );
};

export default FavoriteIcon;
