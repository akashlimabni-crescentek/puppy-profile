import type { Meta, StoryObj } from '@storybook/react-vite'
import { PuppyCardSkeleton } from './PuppyCardSkeleton'

const meta: Meta<typeof PuppyCardSkeleton> = {
  title: 'Molecules/PuppyCardSkeleton',
  component: PuppyCardSkeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof PuppyCardSkeleton>

export const Default: Story = {}
