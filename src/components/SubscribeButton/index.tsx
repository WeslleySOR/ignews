import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripeJS } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data } = useSession()

    const handleSubscribe = async () => {
        if (!data) {
            signIn('github')
            return;
        }
        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data;

            const stripe = await getStripeJS()
            await stripe.redirectToCheckout({ sessionId: sessionId.id })
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <button
            type='button'
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}