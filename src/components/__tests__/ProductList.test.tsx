import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_PRODUCTS } from '../../graphql/queries';
import { ADD_ITEM_TO_ORDER } from '../../graphql/mutations';
import { ProductList } from '../ProductList';
import { OrderProvider } from '../../context/OrderContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mocks = [
    {
        request: {
            query: GET_PRODUCTS,
        },
        result: {
            data: {
                products: {
                    items: [
                        {
                            id: '1',
                            name: 'Product 1',
                            description: 'Description 1',
                            assets: [{ preview: 'preview1.jpg' }],
                            variants: [{ price: 100 }],
                        },
                        {
                            id: '2',
                            name: 'Product 2',
                            description: 'Description 2',
                            assets: [{ preview: 'preview2.jpg' }],
                            variants: [{ price: 200 }],
                        },
                    ],
                },
            },
        },
    },
    {
        request: {
            query: ADD_ITEM_TO_ORDER,
            variables: { productVariantId: '1', quantity: 1 },
        },
        result: {
            data: {
                addItemToOrder: {
                    __typename: 'Order',
                    subTotal: 100,
                    totalQuantity: 1,
                },
            },
        },
    },
];

describe('ProductList', () => {
    it('renders loading state initially', () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                </OrderProvider>
            </MockedProvider>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders products after loading', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                </OrderProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });
    });

    it('handles error state', async () => {
        const errorMock = [
            {
                request: {
                    query: GET_PRODUCTS,
                },
                error: new Error('An error occurred'),
            },
        ];

        render(
            <MockedProvider mocks={errorMock} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                </OrderProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
        });
    });

    it('handles adding item to order', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                    <ToastContainer />
                </OrderProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Buy')[0]);

        await waitFor(() => {
            expect(screen.getByText('Thanks for your purchase!')).toBeInTheDocument();
        });
    });

    it('displays correct product prices', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                </OrderProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Price: 100 USD')).toBeInTheDocument();
            expect(screen.getByText('Price: 200 USD')).toBeInTheDocument();
        });
    });

    it('displays correct product descriptions', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                </OrderProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Description 1')).toBeInTheDocument();
            expect(screen.getByText('Description 2')).toBeInTheDocument();
        });
    });

    it('displays product images', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <OrderProvider>
                    <ProductList />
                </OrderProvider>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByAltText('Product 1')).toHaveAttribute('src', 'preview1.jpg');
            expect(screen.getByAltText('Product 2')).toHaveAttribute('src', 'preview2.jpg');
        });
    });
});
