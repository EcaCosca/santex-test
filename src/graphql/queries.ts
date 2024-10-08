import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query {
    products {
        items{
            id
            name
            description
          	assets {
              preview
            }
          	variants{
              price
            }
        }
      }
  }
`;
