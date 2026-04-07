import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteHeader } from "@/components/site-header";

const meta = {
  title: "Layout/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
