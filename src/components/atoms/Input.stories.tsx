import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { label: 'Email address', type: 'email', placeholder: 'you@example.com' },
}

export const WithHelperText: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    helperText: 'We will never share your email',
    placeholder: 'you@example.com',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    errorMessage: 'Please enter a valid email address',
    placeholder: 'you@example.com',
  },
}

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: '••••••••' },
}

export const Required: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    required: true,
    placeholder: 'you@example.com',
  },
}
