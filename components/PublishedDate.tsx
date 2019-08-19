import * as React from 'react';
import styled from 'styled-components';
import { formatYYMMDDString, formatISOString } from '../entry/date';

type Props = {
  createdAt: number;
};

const Time = styled.time``;

export const PublishedDate = (props: Props) => {
  const { createdAt } = props;
  const dateTime = formatISOString(createdAt);
  const timeValue = formatYYMMDDString(createdAt);

  const e = <Time dateTime={dateTime}>{timeValue}</Time>;

  return e;
};
