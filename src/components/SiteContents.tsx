import styled from 'styled-components';

import { CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';

export const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;

  @media (min-width: 52.125rem) {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} * 1.5) auto 0;
  }
`;
