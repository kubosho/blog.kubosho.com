import styled from 'styled-components';
import { SPACE } from '../common_styles/space';
import { SUB_COLOR, TEXT_COLOR } from '../common_styles/color';
import { NOTE_FONT_SIZE } from '../common_styles/text';

export const PublishedDateContainer = styled.div`
  grid-area: date;
  color: ${TEXT_COLOR};
  font-size: ${NOTE_FONT_SIZE};
`;

export const PublishedDate = styled.time`
  display: inline-block;
  padding: calc(${SPACE} / 2) calc(${SPACE} * 10) calc(${SPACE} / 2) 0;
  border-bottom: 4px solid ${SUB_COLOR};
`;
