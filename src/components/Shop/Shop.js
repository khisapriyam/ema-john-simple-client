import React, { useState } from 'react';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('https://young-coast-34206.herokuapp.com/products')
        .then(res => res.json())
        .then(data => setProducts(data))
    }, [])
    
    useEffect(() =>{
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        fetch('https://young-coast-34206.herokuapp.com/productsByKeys',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
    }, [])
    const handleAddProduct = (product) =>{
        //console.log("product added" ,product);
        const toBeAddedkey = product.key;
        const sameProduct = cart.find(pd => pd.key === product.key);
        let count = 1;
        let newCart;
        if(sameProduct){
            const count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter (pd => pd.key !== toBeAddedkey);
            newCart = [...others, sameProduct];
        }
        else{
            product.quantity= 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count)
        //key ={pd.key}  to avoid warning in console
    }

    return (
        <div className= "twin-container">
            <div className="product-container">
                {
                    products.map(pd => <Product
                        key ={pd.key} 
                        showAddToCart = {true}
                        handleAddProduct = {handleAddProduct}
                        product={pd}
                        ></Product>)
                }  
            </div>
            <div className="cart-container">
                <Cart cart ={cart}> 
                    <Link to ="/review">
                        <button className="main-button">Review Order</button>
                    </Link>
                </Cart>
            </div>
            
            
            
        </div>
    );
};

export default Shop;