import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { LikeButton } from './LikeButton';

const meta: Meta<typeof LikeButton> = {
  title: 'Entry/LikeButton',
  component: LikeButton,
  args: {
    id: '1',
    entryId: 'test-entry',
    likeLabel: '記事にいいねする',
    likedLabel: '記事をすでにいいねしています',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialCount: 0,
  },
};

export const Liked: Story = {
  args: {
    initialCount: 5,
  },
};

export const Interactive: Story = {
  args: {
    initialCount: 0,
  },
  render: (args) => {
    const [count, setCount] = useState(args.initialCount ?? 0);

    return <LikeButton {...args} initialCount={count} onClick={() => setCount((prev) => prev + 1)} />;
  },
};
