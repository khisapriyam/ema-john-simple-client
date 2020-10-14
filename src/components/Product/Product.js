import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import './Product.css';
import { Link } from 'react-router-dom';

const Product = (props) => {
    const{product, handleAddProduct} = props;
    console.log(props)
    const { img, name, seller, price, stock, key } = product;
    return (
        <div className="product">
            <div>
                <img src={img} alt="" />
            </div>
            <div className="name-container">
                <h4 className="product-name"><Link to ={"/product/" + key}>{name}</Link></h4>
                <br />
                <p><small>by: {seller}</small></p>
                <p>${price}</p>
                <p>Only {stock} left in stock - order soon</p>
                {props.showAddToCart === true && <button 
                    className= "main-button"
                    onClick = {()=> handleAddProduct(product)}
                    > 
                        <FontAwesomeIcon icon={faShoppingCart} /> add to cart
                </button>}
            </div>

        </div>
    );
};

export default Product;