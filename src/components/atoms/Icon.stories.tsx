import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'alertCircle',
        'calendar',
        'check',
        'dog',
        'graduationCap',
        'paw',
        'target',
        'triangleAlert',
      ],
    },
    tone: { control: 'select', options: ['inherit', 'brand', 'muted', 'error'] },
    size: { control: 'number' },
    framed: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const BrandMark: Story = {
  args: { name: 'paw', tone: 'brand', framed: true, label: 'Stokeshire' },
}

export const ErrorGlyph: Story = {
  args: { name: 'alertCircle', tone: 'muted', size: 32, strokeWidth: 1.5 },
}

export const FramedError: Story = {
  args: { name: 'alertCircle', tone: 'error', framed: true, label: 'Could not load' },
}

export const InlineMetric: Story = {
  args: { name: 'graduationCap', tone: 'brand', size: 16 },
}
