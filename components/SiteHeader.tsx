import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { MAIN_COLOR, TEXT_COLOR_LIGHT } from '../common_styles/color';
import { SITE_WIDTH } from '../common_styles/size';
import { SPACE, CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_TITLE } from '../constants';
import entries from '../data/entries.json';

const Header = styled.header`
  max-width: ${SITE_WIDTH};
  margin: calc(${CONTENTS_SEPARATOR_SPACE} / 2) auto 0;
  padding: 0 1rem;
  text-align: center;

  @media (min-width: 67.5rem) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;
const Title = styled.h1`
  display: inline-block;
  padding: 0 calc(${SPACE} * 3);
  margin: 0;
  background-color: ${MAIN_COLOR};
  font-size: 1.5rem;
  font-weight: 500;
`;
const StyledLink = styled.a`
  color: ${TEXT_COLOR_LIGHT};
  text-decoration: none;
`;
const CategoryList = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 1rem auto 0;

  @media (min-width: 67.5rem) {
    margin: 0 0 0 auto;
  }
`;
const Category = styled.li`
  ::after {
    content: '｜';
    display: inline-block;
    margin: 0 1rem;
  }

  :last-of-type::after {
    content: '';
    margin: 0;
  }
`;

export const SiteHeader = (): JSX.Element => {
  const categories = getCategories();

  const e = (
    <Header>
      <Title>
        <Link href="/" passHref>
          <StyledLink>{SITE_TITLE}</StyledLink>
        </Link>
      </Title>
      <CategoryList>
        {categories.map((category, i) => (
          <Category key={i}>
            <Link href="/categories/[category]" as={`/categories/${category}`}>
              {category}
            </Link>
          </Category>
        ))}
      </CategoryList>
    </Header>
  );

  return e;
};

function getCategories(): Array<string> {
  const categories = entries.map(entry => entry.categories.reduce((a, c) => a.concat(c)));
  const uniqCategories = new Set(categories);
  const r = Array.from(uniqCategories);

  return r;
}
