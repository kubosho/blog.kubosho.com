import styled from 'styled-components';
import { TEXT_COLOR_LIGHT, SUB_COLOR } from '../common_styles/color';
import { NOTE_FONT_SIZE } from '../common_styles/text';
import { SPACE } from '../common_styles/space';

export const TagList = styled.ul`
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: ${TEXT_COLOR_LIGHT};
  font-size: ${NOTE_FONT_SIZE};
`;

export const TagListItem = styled.li`
  margin-right: calc(${SPACE} * 3);
  background-color: ${SUB_COLOR};

  &:last-child {
    margin-right: 0;
  }

  a:link,
  a:visited {
    color: ${TEXT_COLOR_LIGHT};
    text-decoration: none;
  }
`;
