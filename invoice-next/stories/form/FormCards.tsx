import React, {
  PropsWithChildren,
  createContext,
  useContext,
  ReactElement,
  JSXElementConstructor,
} from "react";

type Size = "small" | "medium" | "large";

const FileCardsContext = createContext<Size>("medium");

const useFormCardsSize = (): Size => {
  const size = useContext(FileCardsContext);
  if (size === undefined) {
    throw new Error(
      "A Card child component must be used within a Card component"
    );
  }
  return size;
};

export type FormCardsProps = PropsWithChildren<{
  size?: Size;
}>;

const Cards = ({ children, size = "medium" }: FormCardsProps): ReactElement => (
  <FileCardsContext.Provider value={size}>{children}</FileCardsContext.Provider>
);

type CardProps = {
  children: React.ReactNode | ((size: Size) => React.ReactNode);
};
const Card = ({ children }: CardProps) => {
  const size = useFormCardsSize();
  return <>{typeof children === "function" ? children(size) : children}</>;
};

type CardConstructorProps = PropsWithChildren<{
  ConstructorComponent: JSXElementConstructor<
    PropsWithChildren<{ size: Size }>
  >;
}>;
const CardConstructor = ({
  ConstructorComponent,
  children,
  ...props
}: CardConstructorProps) => {
  const size = useFormCardsSize();
  return <ConstructorComponent size={size} {...props}>{children}</ConstructorComponent>;
};

export const FormCards = Object.assign(Cards, {
  Card,
  CardConstructor,
});

export default FormCards;
