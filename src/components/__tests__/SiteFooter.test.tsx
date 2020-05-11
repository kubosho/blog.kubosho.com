import React from 'react';
import renderer from 'react-test-renderer';
import { SiteFooter } from '../SiteFooter';

it('SiteFooter', () => {
  const element = <SiteFooter />;
  const actual = renderer.create(element).toJSON();

  expect(actual).toMatchSnapshot();
});
