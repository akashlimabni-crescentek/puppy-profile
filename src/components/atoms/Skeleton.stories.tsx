import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '320px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const DefaultLine: Story = { args: { width: 'w-full', height: 'h-4' } }
export const Heading: Story = { args: { width: 'w-48', height: 'h-7' } }
export const Circle: Story = { args: { width: 'w-24', height: 'h-24', circle: true } }
export const Chip: Story = { args: { width: 'w-20', height: 'h-16', className: 'rounded-2xl' } }
