import styled from 'styled-components';
import { useOrder } from '../context/OrderContext';

const StyledHeader = styled.header`
  background: linear-gradient(135deg, #ff7e5f, #feb47b); /* Gradient background */
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  position: relative;
  z-index: 100;
`;

const Logo = styled.img.attrs({
  src: "https://santex.wpengine.com/wp-content/uploads/2019/02/logo-santex@3x.png",
  alt: "logo"
})`
  height: 50px;
`;

const SubTotal = styled.div`
  color: white;
  font-size: 24px; /* Larger and more readable font */
  font-weight: bold;
  background: rgba(255, 255, 255, 0.15); /* Slight translucent background */
  padding: 10px 20px;
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* More shadow to pop */
`;

export function Header() {
  const { subTotal } = useOrder() || { subTotal: 0 };

  return (
    <StyledHeader>
      <Logo />
      <SubTotal>$ {subTotal}</SubTotal>
    </StyledHeader>
  );
}
