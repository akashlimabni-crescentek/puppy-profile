import type { Meta, StoryObj } from '@storybook/react-vite'
import { PuppyProfileCard } from './PuppyProfileCard'
import { mockPuppy, mockPuppyNoFocus, mockPuppyNoPhoto } from '@utils/mockData'

const meta: Meta<typeof PuppyProfileCard> = {
  title: 'Organisms/PuppyProfileCard',
  component: PuppyProfileCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { familyName: 'Testerson' },
}

export default meta
type Story = StoryObj<typeof PuppyProfileCard>

export const Default: Story = {
  args: { puppy: mockPuppy },
}

export const NoWeeklyFocus: Story = {
  args: { puppy: mockPuppyNoFocus },
}

export const NoPhoto: Story = {
  args: { puppy: mockPuppyNoPhoto },
}
