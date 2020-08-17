import styled from 'styled-components';

export const EntryListHeader = styled.h2`
  font-size: 1rem;

  @media (min-width: 37.5rem) {
    font-size: calc(1rem + ((1vw - 0.375rem) * 3.419));
  }

  @media (min-width: 52.125rem) {
    font-size: 1.5rem;
  }
`;
