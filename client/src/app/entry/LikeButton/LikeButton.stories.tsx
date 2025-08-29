import type { Meta, StoryObj } from '@storybook/react-vite';

import { LikeButton } from './LikeButton';

const meta: Meta<typeof LikeButton> = {
  title: 'Entry/LikeButton',
  component: LikeButton,
  args: {
    counts: 0,
    entryId: 'test-entry',
    likeLabel: '記事にいいねする',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Liked: Story = {
  args: {
    counts: 10,
  },
};

export const Interactive: Story = {
  args: {
    counts: 0,
  },
  render: (args) => {
    return <LikeButton {...args} />;
  },
};
