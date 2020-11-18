import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SimpleCardForm from './SimpleCardForm';


const stripePromise = loadStripe('pk_test_51HooOeCfELaNgfxqPorAUUt94H1H0LqIDEorTlKx1nxCokkSKr643XN5lJYKfixK8Ao4dZaZ3SCP5XI3p98qWyJE00P4xaDSkC');

const ProcessPayment = ({handlePayment}) => {
    return (
        <Elements stripe={stripePromise}>
            <SimpleCardForm handlePayment={handlePayment}></SimpleCardForm>
        </Elements>
    );
};

export default ProcessPayment;