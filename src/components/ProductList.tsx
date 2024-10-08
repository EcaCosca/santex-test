import React from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { ADD_ITEM_TO_ORDER } from '../graphql/mutations';
import { useOrder } from '../context/OrderContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Product = {
  id: string;
  name: string;
  description: string;
  assets: Array<{ preview: string }>;
  variants: Array<{ price: number }>;
};

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-items: center;
`;

const ProductCard = styled.div<{ children?: React.ReactNode }>`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 250px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px); /* Hover lift effect */
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img.attrs((props: { src: string; alt: string }) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05); /* Slight zoom on hover */
  }
`;

const BuyButton = styled.button.attrs((props: { onClick: () => void }) => ({
  onClick: props.onClick,
}))<{ children?: React.ReactNode }>`
  background-color: #ff7e5f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #feb47b; /* Lighter orange on hover */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

export const ProductList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [addItemToOrder] = useMutation(ADD_ITEM_TO_ORDER);
  const { setOrderDetails } = useOrder();

  console.log('data:', data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleBuyClick = async (productVariantId: string) => {
    try {
      const response = await addItemToOrder({
        variables: {
          productVariantId,
          quantity: 1,
        },
      });

      if (response.data.addItemToOrder.__typename === 'Order') {
        const { subTotal, totalQuantity } = response.data.addItemToOrder;
        setOrderDetails({ subTotal, totalQuantity });
        console.log('Item added to order', response.data.addItemToOrder);
        notify();
        notify(`Your total is $${subTotal}.-`);
      } else if (response.data.addItemToOrder.__typename === 'ErrorResult') {
        console.error('Error adding item to order:', response.data.addItemToOrder.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const notify = (message = "Thanks for your purchase!") => toast(message);

  const validProducts = data?.products.items.filter((product: Product) => {
    const hasPreview = product.assets[0]?.preview;
    const hasDescription = product.description?.trim().length > 0;
    const validPrice = product.variants[0]?.price > 0;
    return hasPreview && hasDescription && validPrice;
  });

  return (
    <ProductGrid>
      {validProducts.map((product: Product) => (
        <ProductCard key={product.id.toString()}>
          <ProductImage src={product.assets[0].preview} alt={product.name} />
          <ProductName>{product.name}</ProductName>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice>Price: {product.variants[0].price} USD</ProductPrice>
          <BuyButton onClick={() => handleBuyClick(product.id)}>Buy</BuyButton>
        </ProductCard>
      ))}
    </ProductGrid>
  );
};
