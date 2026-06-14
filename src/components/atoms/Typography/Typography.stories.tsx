import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Typography>

export const Heading1: Story = { args: { children: 'Heading 1', variant: 'h1' } }
export const Heading2: Story = { args: { children: 'Heading 2', variant: 'h2' } }
export const Heading3: Story = { args: { children: 'Heading 3', variant: 'h3' } }
export const Body: Story = { args: { children: 'Body text for reading', variant: 'body' } }
export const BodySmall: Story = { args: { children: 'Smaller body text', variant: 'bodySmall' } }
export const Label: Story = { args: { children: 'Form label', variant: 'label' } }
export const Caption: Story = { args: { children: 'Caption text', variant: 'caption' } }
export const Secondary: Story = {
  args: { children: 'Secondary color', variant: 'body', color: 'secondary' },
}
export const Muted: Story = {
  args: { children: 'Muted color', variant: 'body', color: 'muted' },
}
export const Success: Story = {
  args: { children: 'Success text', variant: 'label', color: 'success' },
}
export const Error: Story = {
  args: { children: 'Error text', variant: 'label', color: 'error' },
}
