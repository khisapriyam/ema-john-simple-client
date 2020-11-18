import React, { useContext } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import ProcessPayment from '../ProcessPayment/ProcessPayment';
import './Shipment.css';

const Shipment = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [shippingData, setShippingData] = useState(null);
    
    const onSubmit = data => {
        setShippingData(data);   
    };

    const handlePaymentSuccess = paymentID => {
        const savedCart = getDatabaseCart();
        const orderDetails = { 
            ...loggedInUser, 
            products: savedCart, 
            shipment: shippingData,
            paymentID, 
            orderTime: new Date() }

        fetch('https://young-coast-34206.herokuapp.com/addorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    processOrder();
                    // alert('Your order placed successfully')
                }
            })
    }

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        <div className="row">
            <div style={{display: shippingData ? 'none' : 'block'}} className="col-md-6">
                <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>
                    {/* include validation with required or other standard HTML validation rules */}
                    <input name="name" defaultValue={loggedInUser.name} ref={register({ required: true })} placeholder="Your Name" />
                    {/* errors will return when field validation fails  */}
                    {errors.name && <span className="error">Name is required</span>}

                    <input name="email" defaultValue={loggedInUser.email} ref={register({ required: true })} placeholder="Your Email" />
                    {errors.email && <span className="error">Email is required</span>}

                    <input name="address" ref={register({ required: true })} placeholder="Your Address" />
                    {errors.address && <span className="error">Address is required</span>}

                    <input name="phone" ref={register({ required: true })} placeholder="Your Phone Number" />
                    {errors.phone && <span className="error">Phone Number is required</span>}


                    <input type="submit" />
                </form>
            </div>
            <div id="processPayment" style={{display: shippingData ? 'block' : 'none'}} className="col-md-6">
                <h5>Please pay using demo credit card no 4242 4242 4242 4242 to avoid error</h5>
                <br/>
                <ProcessPayment handlePayment={handlePaymentSuccess}></ProcessPayment>
            </div>
        </div>

    );
};

export default Shipment;