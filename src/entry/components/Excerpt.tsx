import styled from 'styled-components';

export const Excerpt = styled.p`
  font-size: 0.875rem;

  @media (min-width: 37.5rem) {
    font-size: calc(0.875rem + (1vw - 0.375rem) * (16 / (854 - 600)));
  }

  @media (min-width: 52.125rem) {
    font-size: 1rem;
  }
`;
