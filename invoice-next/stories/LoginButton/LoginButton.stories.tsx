import { ComponentStory, ComponentMeta } from "@storybook/react";
import LoginButton from "./LoginButton";

/** Theme */

export default {
  component: LoginButton,
  title: "LoginButton",
} as ComponentMeta<typeof LoginButton>;

const LoginButtonTemplate: ComponentStory<typeof LoginButton> = ({
  ...args
}) => <LoginButton {...args} />;

export const LoginButtonForm = LoginButtonTemplate.bind({});
LoginButtonForm.args = {};
