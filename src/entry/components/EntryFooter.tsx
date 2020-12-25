import styled from 'styled-components';
import { BASE_FONT_SIZE } from '../../common_styles/text';

export const EntryFooter = styled.footer`
  font-size: ${BASE_FONT_SIZE};

  @media (min-width: 37.5rem) {
    font-size: calc(${BASE_FONT_SIZE} + (1vw - 0.375rem) * (16 / (854 - 600)));
  }

  @media (min-width: 52.125rem) {
    font-size: calc(${BASE_FONT_SIZE} * 1.125);
  }
`;
