import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoRow } from './InfoRow'
import { Badge } from '@atoms/Badge'
import { Icon } from '@atoms/Icon'

const meta: Meta<typeof InfoRow> = {
  title: 'Molecules/InfoRow',
  component: InfoRow,
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
type Story = StoryObj<typeof InfoRow>

export const StringValue: Story = {
  args: {
    label: 'Birth date',
    value: 'March 14, 2026',
    icon: <Icon name="calendar" size={16} strokeWidth={1.75} />,
  },
}

export const NodeValue: Story = {
  args: {
    label: 'Status',
    icon: <Icon name="target" size={16} strokeWidth={1.75} />,
    value: <Badge label="In school" variant="neutral" />,
  },
}

export const NoIcon: Story = {
  args: { label: 'Program', value: 'Doodle School' },
}

export const LongValue: Story = {
  args: {
    label: 'Weekly focus',
    value: 'Novel surfaces and gentle handling; building calm recovery after startle.',
    icon: <Icon name="target" size={16} strokeWidth={1.75} />,
  },
}
