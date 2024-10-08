import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Header } from '../Header';
import { useOrder } from '../../context/OrderContext';

jest.mock('../../context/OrderContext', () => ({
    useOrder: jest.fn(),
}));

describe('Header component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display the logo', () => {
        (useOrder as jest.Mock).mockReturnValue({ subTotal: 0 });

        const { getByAltText } = render(<Header />);
        const logo = getByAltText('logo');

        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'https://santex.wpengine.com/wp-content/uploads/2019/02/logo-santex@3x.png');
    });

    it('should display the subtotal', () => {
        const mockSubTotal = 123.45;
        (useOrder as jest.Mock).mockReturnValue({ subTotal: mockSubTotal });

        const { getByText } = render(<Header />);
        const subTotalElement = getByText(`$ ${mockSubTotal}`);

        expect(subTotalElement).toBeInTheDocument();
        expect(subTotalElement).toHaveTextContent(`$ ${mockSubTotal}`);
    });

    it('should have correct styles for header', () => {
        (useOrder as jest.Mock).mockReturnValue({ subTotal: 0 });

        const { container } = render(<Header />);
        const header = container.querySelector('header');

        expect(header).toHaveStyle('background: linear-gradient(135deg, #ff7e5f, #feb47b)');
        expect(header).toHaveStyle('padding: 20px 40px');
        expect(header).toHaveStyle('display: flex');
        expect(header).toHaveStyle('align-items: center');
        expect(header).toHaveStyle('justify-content: space-between');
        expect(header).toHaveStyle('box-shadow: 0px 4px 8px rgba(0,0,0,0.1)');
    });

    it('should have correct styles for subtotal', () => {
        (useOrder as jest.Mock).mockReturnValue({ subTotal: 0 });

        const { container } = render(<Header />);
        const subTotalElement = container.querySelector('div');

        expect(subTotalElement).toHaveStyle('color: white');
        expect(subTotalElement).toHaveStyle('font-size: 24px');
        expect(subTotalElement).toHaveStyle('font-weight: bold');
        expect(subTotalElement).toHaveStyle('background: rgba(255,255,255,0.15)');
        expect(subTotalElement).toHaveStyle('padding: 10px 20px');
        expect(subTotalElement).toHaveStyle('border-radius: 8px');
        expect(subTotalElement).toHaveStyle('box-shadow: 0px 4px 12px rgba(0,0,0,0.1)');
    });

    it('should update subtotal when context value changes', () => {
        const { rerender, getByText } = render(<Header />);
        (useOrder as jest.Mock).mockReturnValue({ subTotal: 100 });

        rerender(<Header />);
        const subTotalElement = getByText('$ 100');

        expect(subTotalElement).toBeInTheDocument();
        expect(subTotalElement).toHaveTextContent('$ 100');
    });

    it('should render correctly with zero subtotal', () => {
        (useOrder as jest.Mock).mockReturnValue({ subTotal: 0 });

        const { getByText } = render(<Header />);
        const subTotalElement = getByText('$ 0');

        expect(subTotalElement).toBeInTheDocument();
        expect(subTotalElement).toHaveTextContent('$ 0');
    });
});

