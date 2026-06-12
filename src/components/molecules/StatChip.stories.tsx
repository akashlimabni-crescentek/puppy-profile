import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatChip } from './StatChip'

const meta: Meta<typeof StatChip> = {
  title: 'Molecules/StatChip',
  component: StatChip,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatChip>

export const Age: Story = { args: { label: 'Age', value: '1 yr 2 mo', icon: '🎂' } }
export const Weight: Story = { args: { label: 'Weight', value: '22.5 kg', icon: '⚖️' } }
export const Color: Story = { args: { label: 'Color', value: 'Golden', icon: '🎨' } }
export const NoIcon: Story = { args: { label: 'ID', value: 'A001' } }
