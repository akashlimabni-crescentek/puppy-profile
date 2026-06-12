import type { Meta, StoryObj } from '@storybook/react-vite'
import { PuppyProfileCard } from './PuppyProfileCard'
import { mockPuppy, mockPuppyFemale, mockPuppyOverdue } from '@utils/mockData'

const meta: Meta<typeof PuppyProfileCard> = {
  title: 'Organisms/PuppyProfileCard',
  component: PuppyProfileCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof PuppyProfileCard>

export const MaleUpToDate: Story = {
  args: { puppy: mockPuppy },
}

export const FemaleVaccinationDueSoon: Story = {
  args: { puppy: mockPuppyFemale },
}

export const VaccinationOverdue: Story = {
  args: { puppy: mockPuppyOverdue },
}

export const NoMicrochip: Story = {
  args: { puppy: { ...mockPuppy, microchipId: undefined } },
}
