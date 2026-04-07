import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WarningForm } from "@/components/warning-form";

const meta = {
  title: "Forms/WarningForm",
  component: WarningForm,
  tags: ["autodocs"],
  args: {
    onLocationClear: () => {},
    onCreated: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WarningForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyLocation: Story = {
  args: {
    selectedLocation: null,
  },
};

export const LocationSelected: Story = {
  args: {
    selectedLocation: {
      latitude: 40.4168,
      longitude: -3.7038,
    },
  },
};
