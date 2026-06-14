import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatChip } from './StatChip'
import { Icon } from '@atoms/Icon/Icon'

const meta: Meta<typeof StatChip> = {
  title: 'Molecules/StatChip',
  component: StatChip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatChip>

export const ProgramProgress: Story = {
  args: {
    label: 'Program progress',
    value: 'Week 2 of 4',
    icon: <Icon name="graduationCap" size={16} strokeWidth={1.75} />,
  },
}

export const FinalWeek: Story = {
  args: {
    label: 'Program progress',
    value: 'Week 4 of 4',
    icon: <Icon name="graduationCap" size={16} strokeWidth={1.75} />,
  },
}

export const NoIcon: Story = {
  args: { label: 'Program progress', value: 'Week 1 of 4' },
}
