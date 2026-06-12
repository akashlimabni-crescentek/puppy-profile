import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

const sampleSrc =
  'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400&h=400&fit=crop'

export const Default: Story = {
  args: { src: sampleSrc, alt: 'Biscuit the golden retriever', size: 'lg' },
}

export const Small: Story = {
  args: { src: sampleSrc, alt: 'Small avatar', size: 'sm' },
}

export const Medium: Story = {
  args: { src: sampleSrc, alt: 'Medium avatar', size: 'md' },
}

export const Large: Story = {
  args: { src: sampleSrc, alt: 'Large avatar', size: 'lg' },
}

export const ExtraLarge: Story = {
  args: { src: sampleSrc, alt: 'Extra large avatar', size: 'xl' },
}

export const BrokenImage: Story = {
  args: { src: 'https://broken-url.invalid/image.jpg', alt: 'Broken image fallback', size: 'lg' },
}
