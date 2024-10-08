import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { OrderProvider, useOrder } from '../OrderContext';

const TestComponent: React.FC = () => {
    const { subTotal, totalQuantity, setOrderDetails } = useOrder();

    return (
        <div>
            <div data-testid="subTotal">{subTotal}</div>
            <div data-testid="totalQuantity">{totalQuantity}</div>
            <button onClick={() => setOrderDetails({ subTotal: 100, totalQuantity: 5 })}>
                Update Order
            </button>
        </div>
    );
};

describe('OrderContext', () => {
    it('provides initial values from useStateWithStorage', () => {
        render(
            <OrderProvider>
                <TestComponent />
            </OrderProvider>
        );

        expect(screen.getByTestId('subTotal').textContent).toBe('0');
        expect(screen.getByTestId('totalQuantity').textContent).toBe('0');
    });

    it('updates values when setOrderDetails is called', () => {
        render(
            <OrderProvider>
                <TestComponent />
            </OrderProvider>
        );

        act(() => {
            screen.getByText('Update Order').click();
        });

        expect(screen.getByTestId('subTotal').textContent).toBe('100');
        expect(screen.getByTestId('totalQuantity').textContent).toBe('5');
    });

    it('throws an error if useOrder is used outside of OrderProvider', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        const renderOutsideProvider = () => {
            render(<TestComponent />);
        };

        expect(renderOutsideProvider).toThrow('useOrder must be used within an OrderProvider');

        consoleError.mockRestore();
    });

    it('maintains state between renders', () => {
        const { rerender } = render(
            <OrderProvider>
                <TestComponent />
            </OrderProvider>
        );

        act(() => {
            screen.getByText('Update Order').click();
        });

        rerender(
            <OrderProvider>
                <TestComponent />
            </OrderProvider>
        );

        expect(screen.getByTestId('subTotal').textContent).toBe('100');
        expect(screen.getByTestId('totalQuantity').textContent).toBe('5');
    });

    it('resets state when OrderProvider is re-mounted', () => {
        const { unmount } = render(
            <OrderProvider>
                <TestComponent />
            </OrderProvider>
        );

        act(() => {
            screen.getByText('Update Order').click();
        });

        unmount();

        render(
            <OrderProvider>
                <TestComponent />
            </OrderProvider>
        );

        expect(screen.getByTestId('subTotal').textContent).toBe('0');
        expect(screen.getByTestId('totalQuantity').textContent).toBe('0');
    });
});