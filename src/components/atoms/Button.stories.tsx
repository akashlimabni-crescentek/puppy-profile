import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Sign in', variant: 'primary', size: 'md' },
}

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary', size: 'md' },
}

export const Ghost: Story = {
  args: { children: 'Sign out', variant: 'ghost', size: 'sm' },
}

export const Danger: Story = {
  args: { children: 'Delete account', variant: 'danger', size: 'md' },
}

export const Loading: Story = {
  args: { children: 'Signing in…', variant: 'primary', isLoading: true },
}

export const Disabled: Story = {
  args: { children: 'Unavailable', variant: 'primary', disabled: true },
}

export const FullWidth: Story = {
  args: { children: 'Full width button', variant: 'primary', fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Large: Story = {
  args: { children: 'Large button', variant: 'primary', size: 'lg' },
}
