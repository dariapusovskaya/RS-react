import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

interface ProductDetails {
    id: number;
    title: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    rating: number;
    stock: number;
    thumbnail: string;
}

interface DetailsContext {
    itemId: string | null;
}

const ItemDetails = () => {
    const { itemId } = useOutletContext<DetailsContext>();

    const [item, setItem] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!itemId) {
            setItem(null);
            return;
        } 

        const fetchItemDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://dummyjson.com/products/${itemId}`);
                const data = await response.json();
                setItem(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load item details');
                setLoading(false);
            }
        };

        fetchItemDetails();

    }, [itemId]);

    if (!itemId) {
        return null;
    } 

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                    }} />
                    <p>Loading details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                {error}
            </div>
        );
    }

    if (!item) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Item not found
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>{item.title}</h2>
        
                {item.thumbnail && (
            <img 
                src={item.thumbnail} 
                alt={item.title} 
                style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '16px' }}
            />
        )}
        
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Brand:</strong> {item.brand}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Rating:</strong> {item.rating} / 5</p>
            <p><strong>Stock:</strong> {item.stock} units</p>
        </div>
    )
}

export default ItemDetails;