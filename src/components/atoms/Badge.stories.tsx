import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { label: 'Golden Retriever', variant: 'neutral' },
}

export const Success: Story = {
  args: { label: 'Up to date', variant: 'success', icon: '✓' },
}

export const Warning: Story = {
  args: { label: 'Due soon', variant: 'warning', icon: '⚠' },
}

export const Error: Story = {
  args: { label: 'Overdue', variant: 'error', icon: '✗' },
}

export const Info: Story = {
  args: { label: 'Male', variant: 'info', icon: '♂' },
}

export const MediumSize: Story = {
  args: { label: 'Medium badge', variant: 'success', size: 'md' },
}
