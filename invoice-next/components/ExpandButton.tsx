import { ExpandMore, KeyboardArrowDown } from "@mui/icons-material";
import { Button, styled, Theme } from "@mui/material";
import { Component, useState } from "react";
import { css } from "@emotion/react";

const StyledButton = styled("div")(({ expanded }: { expanded: boolean }) => ({
  display: "flex",
  "& > svg": {
    transform: expanded ? "rotate(-180deg)" : "rotate(-360deg)",
    transition: "transform 150ms ease",
  },
}));

const StyledButton2 = styled("div")`
  color: ${(props: { expanded: boolean }) =>
    props.expanded ? "hotpink" : "turquoise"};
  transition: color 300ms ease;
`;

type MyProps = {
  // using `interface` is also ok
  message: string;
};
type MyState = {
  expanded: boolean; // like this
};

class Welcome extends Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.state = { expanded: false };
  }

  handleClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  }
  render() {
    return (
      <>
        <h1>Hello, {this.props.message}</h1>

        <Button onClick={this.handleClick}>
          From{" "}
          <StyledButton expanded={this.state.expanded}>
            <ExpandMore />
          </StyledButton>
        </Button>
      </>
    );
  }
}



const ExpandButton = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <Welcome message="test" />

      <div></div>
      {expanded ? "expanded" : "collapsed"}
      <Button onClick={() => setExpanded(!expanded)}>
        From{" "}
        <StyledButton expanded={expanded}>
          <KeyboardArrowDown />
        </StyledButton>
      </Button>
      <StyledButton2 expanded={expanded}>ss</StyledButton2>
    </div>
  );
};

export default ExpandButton;
