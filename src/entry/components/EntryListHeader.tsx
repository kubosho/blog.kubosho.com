import styled from 'styled-components';
import { BASE_FONT_SIZE } from '../../common_styles/text';

export const EntryListHeader = styled.h2`
  font-size: calc(${BASE_FONT_SIZE} * 1.125);

  @media (min-width: 37.5rem) {
    font-size: calc(${BASE_FONT_SIZE} * 1.125 + ((1vw - 0.375rem) * 3.419));
  }

  @media (min-width: 52.125rem) {
    font-size: 1.5rem;
  }
`;
