import styled from 'styled-components';

export const EntryTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;

  @media (min-width: 37.5rem) {
    font-size: calc(1.5rem + ((1vw - 0.375rem) * 5.128));
  }

  @media (min-width: 52.125rem) {
    font-size: 2.25rem;
  }
`;
