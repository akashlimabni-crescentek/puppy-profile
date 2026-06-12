import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginForm } from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Organisms/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: '360px', padding: '2rem', background: 'white', borderRadius: '1.5rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Default: Story = {
  args: { onSubmit: (values) => console.log('Submitted:', values) },
}

export const Loading: Story = {
  args: { onSubmit: () => {}, isLoading: true },
}

export const WithAuthError: Story = {
  args: {
    onSubmit: () => {},
    errorMessage: 'Invalid email or password. Please try again.',
  },
}

export const WithRoleError: Story = {
  args: {
    onSubmit: () => {},
    errorMessage: 'Access denied. Family account required.',
  },
}
