import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'
import { Icon } from '@atoms/Icon/Icon'

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
  args: { label: 'F1 Australian Mountain Dog', variant: 'neutral' },
}

export const Success: Story = {
  args: {
    label: 'In school',
    variant: 'success',
    icon: <Icon name="check" size={12} strokeWidth={2} />,
  },
}

export const Warning: Story = {
  args: { label: 'Starting soon', variant: 'warning' },
}

export const Error: Story = {
  args: { label: 'On hold', variant: 'error' },
}

export const Info: Story = {
  args: { label: 'Doodle School', variant: 'info' },
}

export const MediumSize: Story = {
  args: { label: 'Medium badge', variant: 'success', size: 'md' },
}
