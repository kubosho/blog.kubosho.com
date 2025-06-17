import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { LikeButton } from './LikeButton';

const meta: Meta<typeof LikeButton> = {
  title: 'Entry/LikeButton',
  component: LikeButton,
  args: {
    id: 'like-button',
    likeLabel: '記事にいいねする',
    likedLabel: '記事をすでにいいねしています',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    liked: false,
  },
};

export const Liked: Story = {
  args: {
    liked: true,
  },
};

export const Interactive: Story = {
  args: {
    liked: false,
  },
  render: (args) => {
    const [liked, setLiked] = useState(args.liked);

    return <LikeButton {...args} liked={liked} onClick={() => setLiked(!liked)} />;
  },
};
