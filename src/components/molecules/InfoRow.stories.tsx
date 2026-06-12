import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfoRow } from './InfoRow'
import { Badge } from '@atoms/Badge'

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
  args: { label: 'Birthday', value: 'April 10, 2023', icon: '📅' },
}

export const BadgeValue: Story = {
  args: {
    label: 'Vaccination',
    icon: '💉',
    value: <Badge label="Up to date" variant="success" icon="✓" />,
  },
}

export const NoIcon: Story = {
  args: { label: 'Microchip ID', value: 'MC-9876543210' },
}

export const LongValue: Story = {
  args: { label: 'Family ID', value: 'fam-abc123-def456-ghi789', icon: '🏠' },
}
