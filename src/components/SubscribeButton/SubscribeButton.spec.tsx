import { render, screen, fireEvent } from '@testing-library/react'
import { SubscribeButton } from '.'

import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { mocked } from 'jest-mock'
import { stripe } from '../../services/stripe'
import { getStaticProps } from '../../pages'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/stripe')

describe('SubscribeButton Component', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce(
            { 
                data: null,
                status: "unauthenticated"
            }
        )
        render(<SubscribeButton/>)    
        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
    })

    it('redirect user to sign in when not authenticated', () => {
        const signInMocked = mocked(signIn)
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce(
            { 
                data: null,
                status: "unauthenticated"
            }
        )
        render(<SubscribeButton/>)

        const subscribeButton = screen.getByText('Subscribe now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn()
        
        useSessionMocked.mockReturnValueOnce(
            { 
                data: {
                    user: 
                    {
                        name: 'John Doe', 
                        email: 'johndoe@example.com'
                    }, 
                    activeSubscription: 'fake-active-subscription',
                    expires: 'fake-expires'
                },
                status: "authenticated"
            }
        )

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton/>)

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalledWith('/posts')

    })

    it('loads initial data', async () => {
        const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)
        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})